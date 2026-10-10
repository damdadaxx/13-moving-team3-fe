import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getChatMessages,
  getChatRooms,
  getChatUnreadCount,
} from '@/lib/api/chat';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

/** 내 채팅방 목록 (GNB 플로팅 버튼 - 배지 합산·목록 둘 다 이 쿼리로 계산)
 * - 실시간 새 메시지/읽음 반영은 Supabase 구독에서 이 쿼리를 invalidate 한다
 */
export function useChatRoomsQuery(enabled: boolean) {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: getChatRooms,
    enabled,
    meta: { name: '내 채팅방 목록' },
  });
}

/** 채팅 메시지 목록 (커서 무한 스크롤)
 * - ACCEPTED·COMPLETED 상태에서만 enabled로 열어준다
 */
export function useChatMessagesQuery(estimateId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(estimateId),
    queryFn: ({ pageParam }) =>
      getChatMessages(estimateId, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    meta: { name: '채팅 메시지 목록' },
  });
}

/** 채팅방 안 읽은 메시지 수 (GNB 배지용) */
export function useChatUnreadCountQuery(estimateId: string, enabled: boolean) {
  return useQuery({
    queryKey: chatKeys.unreadCount(estimateId),
    queryFn: () => getChatUnreadCount(estimateId),
    enabled,
    meta: { name: '채팅 안 읽은 메시지 수' },
  });
}
