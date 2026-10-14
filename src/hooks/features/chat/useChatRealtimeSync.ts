'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  getSupabaseAccessToken,
  subscribeSupabaseAccessToken,
} from '@/lib/supabase/accessToken';
import { supabase } from '@/lib/supabase/client';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

interface ChatMessageRow {
  estimate_id?: string;
}

const RETRY_MS = 2_000;
let channelSeq = 0;

/*
@ 채팅 실시간 반영
- chat_messages 테이블 변경(새 메시지·읽음 처리)을 구독해
  채팅방 목록(배지·마지막 메시지)과, 해당 방이 열려 있으면 메시지 목록을 갱신한다
- 토큰이 생기기 전에는 구독하지 않는다. anon으로 붙으면 authenticated 정책에 막힌다
- 채널이 닫히거나 실패하면 다시 구독한다. 토큰이 바뀌면 새 토큰으로 다시 붙는다
*/
export function useChatRealtimeSync(enabled: boolean) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeSupabaseAccessToken,
    getSupabaseAccessToken,
    () => null,
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !token) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase
      .channel(`chat-messages-sync-${++channelSeq}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const row = (payload.new ?? payload.old) as ChatMessageRow | null;
          const estimateId = row?.estimate_id;

          void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
          if (estimateId) {
            void queryClient.invalidateQueries({
              queryKey: chatKeys.messages(estimateId),
            });
          }
        },
      )
      .subscribe((status) => {
        if (
          cancelled ||
          status === 'SUBSCRIBED' ||
          (status !== 'CHANNEL_ERROR' &&
            status !== 'TIMED_OUT' &&
            status !== 'CLOSED')
        ) {
          return;
        }

        clearTimeout(retryTimer);
        retryTimer = setTimeout(() => {
          if (!cancelled) setAttempt((value) => value + 1);
        }, RETRY_MS);
      });

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      void supabase.removeChannel(channel);
    };
  }, [enabled, token, attempt, queryClient]);
}
