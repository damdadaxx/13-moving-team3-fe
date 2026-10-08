'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

interface ChatMessageRow {
  estimate_id?: string;
}

/*
@ 채팅 실시간 반영
- chat_messages 테이블 변경(새 메시지·읽음 처리)을 구독해
  채팅방 목록(배지·마지막 메시지)과, 해당 방이 열려 있으면 메시지 목록을 갱신한다
- BE가 anon key(publishable key)에 대한 chat_messages SELECT RLS를 허용해야
  이벤트가 실제로 들어온다. 막혀 있으면 구독은 연결되지만 이벤트가 오지 않는다
*/
export function useChatRealtimeSync(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel('chat-messages-sync')
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
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);
}
