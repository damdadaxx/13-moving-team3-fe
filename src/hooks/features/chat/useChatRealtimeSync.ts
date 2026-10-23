'use client';

import { useEffect } from 'react';

import type { ChatMessage } from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';

import { chatSocket } from '@/lib/socket/client';

import {
  addChatMessageToCache,
  hasChatMessageInCache,
  refreshLatestChatMessages,
  setMessagesReadByOthersInCache,
} from '@/hooks/features/chat/chatMessageCache';
import { chatKeys } from '@/hooks/features/chat/queries/keys';

interface JoinRoomAck {
  ok: boolean;
  message?: string;
}

// 짧은 시간에 몰려 오는 이벤트를 한 번의 방 목록 재조회로 묶는다
const REFETCH_DEBOUNCE_MS = 300;

/*
@ 채팅 실시간 반영 (Socket.IO)
- 내 채팅방 전부를 room으로 join한다. 'message'/'read' payload에 estimateId가 들어있어서
  (BE가 추가해줌) 여러 방을 동시에 join해도 이벤트가 어느 방 것인지 구분할 수 있다
- 'message': 새 메시지. payload에 이미지면 signed URL까지 들어있어 재조회 없이 바로 캐시에 추가
- 'read': 상대방이 내가 보낸 메시지를 읽었다는 뜻. messageId는 없고 { estimateId, readerId }뿐이라
  readerId가 보낸 게 아닌(=내가 보낸) 메시지를 전부 읽음으로 바꾼다
- estimateIds가 바뀌면(새 방이 채팅방 목록에 추가되는 등) 이전 목록은 leave하고 새 목록으로 다시 join한다
- 재연결은 socket.io-client 기본 지수 백오프에 맡긴다. 'connect'마다 전체 다시 join하고,
  끊긴 동안 놓친 메시지를 각 방 최신 한 페이지만 받아 캐시에 합쳐 따라잡는다
*/
export function useChatRealtimeSync(estimateIds: string[], enabled: boolean) {
  const queryClient = useQueryClient();
  // 배열 identity가 매 렌더 바뀌어도 내용이 같으면 effect를 다시 돌리지 않는다
  const idsKey = estimateIds.slice().sort().join(',');

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];
    if (!enabled || ids.length === 0) return;

    const joinedIds = new Set<string>();
    let roomsTimer: ReturnType<typeof setTimeout> | undefined;

    const refreshRooms = () => {
      clearTimeout(roomsTimer);
      roomsTimer = setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      }, REFETCH_DEBOUNCE_MS);
    };

    const joinAll = () => {
      ids.forEach((estimateId) => {
        chatSocket.emit('join-room', estimateId, (ack: JoinRoomAck) => {
          if (!ack.ok) return;
          joinedIds.add(estimateId);
          // 처음 들어오거나 재연결로 다시 들어온 경우나 동일하게, 놓쳤을 수 있는
          // 최신 메시지를 따라잡는다
          void refreshLatestChatMessages(queryClient, estimateId);
        });
      });
    };

    const handleMessage = (message: ChatMessage) => {
      refreshRooms();
      if (
        hasChatMessageInCache(
          queryClient,
          message.estimateId,
          message.messageId,
        )
      ) {
        return;
      }
      addChatMessageToCache(queryClient, message.estimateId, message);
    };

    const handleRead = ({
      estimateId,
      readerId,
    }: {
      estimateId: string;
      readerId: string;
    }) => {
      setMessagesReadByOthersInCache(queryClient, estimateId, readerId);
    };

    chatSocket.on('message', handleMessage);
    chatSocket.on('read', handleRead);
    chatSocket.on('connect', joinAll);

    if (!chatSocket.connected) {
      chatSocket.connect();
    } else {
      joinAll();
    }

    return () => {
      chatSocket.off('message', handleMessage);
      chatSocket.off('read', handleRead);
      chatSocket.off('connect', joinAll);
      clearTimeout(roomsTimer);
      joinedIds.forEach((estimateId) => {
        chatSocket.emit('leave-room', estimateId);
      });
    };
  }, [idsKey, enabled, queryClient]);
}
