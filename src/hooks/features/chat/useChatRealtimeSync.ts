'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  getSupabaseAccessToken,
  subscribeSupabaseAccessToken,
} from '@/lib/supabase/accessToken';
import { supabase } from '@/lib/supabase/client';

import {
  addChatMessageToCache,
  hasChatMessageInCache,
  refreshLatestChatMessages,
  setChatMessageReadInCache,
} from '@/hooks/features/chat/chatMessageCache';
import { chatKeys } from '@/hooks/features/chat/queries/keys';

interface ChatMessageRow {
  id?: number | string;
  estimate_id?: string;
  sender_id?: string;
  content?: string | null;
  image_url?: string | null;
  is_read?: boolean;
  created_at?: string;
}

const RETRY_BASE_MS = 2_000;
const RETRY_MAX_MS = 30_000;
// 짧은 시간에 몰려 오는 이벤트(예: 읽음 처리 UPDATE가 행마다 한 건씩)를 한 번의 재조회로 묶는다
const REFETCH_DEBOUNCE_MS = 300;
let channelSeq = 0;

/*
@ 채팅 실시간 반영
- chat_messages 테이블 변경(새 메시지·읽음 처리)을 구독해 화면을 갱신한다
- 이벤트마다 목록을 다시 불러오면 요청이 연쇄로 쌓여 점점 느려진다.
  그래서 payload로 알 수 있는 변경은 캐시에 바로 반영하고, 재조회는 필요한 경우에만 모아서 한 번 한다
  - INSERT(텍스트): 메시지 캐시에 바로 추가
  - INSERT(이미지): image_url이 저장 경로라 화면에 쓸 수 없다 (서버가 signed URL로 바꿔 줌) → 재조회
  - UPDATE(읽음): 해당 메시지의 isRead만 캐시에서 바꾼다
  - DELETE: payload에 방 정보가 없을 수 있어 메시지 목록 전체를 재조회
  - 재조회가 필요할 때도 최신 한 페이지만 받아 캐시에 합친다 (이미 불러온 이전 메시지는 유지)
  - 채팅방 목록(배지·마지막 메시지)은 서버 집계라 재조회하되, 이벤트가 몰려도 한 번만 한다
- 토큰이 생기기 전에는 구독하지 않는다. anon으로 붙으면 authenticated 정책에 막힌다
- 채널이 닫히거나 실패하면 다시 구독한다 (2초부터 30초까지 늘려가며 재시도).
  토큰이 바뀌면 새 토큰으로 다시 붙는다
*/
export function useChatRealtimeSync(enabled: boolean) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeSupabaseAccessToken,
    getSupabaseAccessToken,
    () => null,
  );
  const [attempt, setAttempt] = useState(0);
  // 재시도 횟수는 채널을 새로 만들어도 이어져야 해서 ref에 둔다 (구독에 성공하면 0으로 되돌린다)
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!enabled || !token) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let roomsTimer: ReturnType<typeof setTimeout> | undefined;
    const messagesTimers = new Map<string, ReturnType<typeof setTimeout>>();

    const refreshRooms = () => {
      clearTimeout(roomsTimer);
      roomsTimer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      }, REFETCH_DEBOUNCE_MS);
    };

    // estimateId가 없으면 모든 방의 메시지 목록을 대상으로 한다
    const refreshMessages = (estimateId?: string) => {
      const timerKey = estimateId ?? '*';
      clearTimeout(messagesTimers.get(timerKey));
      messagesTimers.set(
        timerKey,
        setTimeout(() => {
          messagesTimers.delete(timerKey);
          // 방을 알면 최신 메시지만 합치고(이전 메시지 유지), 모르면 전체를 다시 받는다
          if (estimateId) {
            void refreshLatestChatMessages(queryClient, estimateId);
            return;
          }
          void queryClient.invalidateQueries({
            queryKey: [...chatKeys.all, 'messages'],
          });
        }, REFETCH_DEBOUNCE_MS),
      );
    };

    const channel = supabase
      .channel(`chat-messages-sync-${++channelSeq}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const row = (payload.new ?? payload.old) as ChatMessageRow | null;
          const estimateId = row?.estimate_id;
          const messageId = row?.id === undefined ? null : String(row.id);

          refreshRooms();

          if (payload.eventType === 'DELETE') {
            refreshMessages(estimateId);
            return;
          }
          if (!estimateId || !messageId) return;

          if (payload.eventType === 'UPDATE') {
            if (typeof row.is_read === 'boolean') {
              setChatMessageReadInCache(
                queryClient,
                estimateId,
                messageId,
                row.is_read,
              );
            }
            return;
          }

          // INSERT: 내가 보낸 메시지는 전송 응답으로 이미 캐시에 들어 있을 수 있다
          if (hasChatMessageInCache(queryClient, estimateId, messageId)) return;

          if (row.image_url || !row.sender_id || !row.created_at) {
            refreshMessages(estimateId);
            return;
          }

          addChatMessageToCache(queryClient, estimateId, {
            messageId,
            senderId: row.sender_id,
            content: row.content ?? null,
            imageUrl: null,
            isRead: row.is_read ?? false,
            createdAt: row.created_at,
          });
        },
      )
      .subscribe((status) => {
        if (cancelled) return;

        if (status === 'SUBSCRIBED') {
          // 끊겼다가 다시 붙은 경우, 끊긴 동안 놓친 메시지를 따라잡는다
          if (retryCountRef.current > 0) {
            refreshRooms();
            queryClient
              .getQueryCache()
              .findAll({ queryKey: [...chatKeys.all, 'messages'] })
              .forEach((query) => {
                const estimateId = query.queryKey[2];
                if (typeof estimateId === 'string') {
                  void refreshLatestChatMessages(queryClient, estimateId);
                }
              });
          }
          retryCountRef.current = 0;
          return;
        }
        if (
          status !== 'CHANNEL_ERROR' &&
          status !== 'TIMED_OUT' &&
          status !== 'CLOSED'
        ) {
          return;
        }

        clearTimeout(retryTimer);
        const delay = Math.min(
          RETRY_BASE_MS * 2 ** retryCountRef.current,
          RETRY_MAX_MS,
        );
        retryCountRef.current += 1;
        retryTimer = setTimeout(() => {
          if (!cancelled) setAttempt((value) => value + 1);
        }, delay);
      });

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      clearTimeout(roomsTimer);
      messagesTimers.forEach((timer) => clearTimeout(timer));
      void supabase.removeChannel(channel);
    };
  }, [enabled, token, attempt, queryClient]);
}
