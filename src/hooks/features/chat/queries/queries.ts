import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getChatMessages,
  getChatRooms,
  getChatUnreadCount,
} from '@/lib/api/chat';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

/** 내 채팅방 목록 (GNB 플로팅 버튼 - 배지 합산·목록 둘 다 이 쿼리로 계산)
 * - 실시간 새 메시지/읽음 반영은 socket 이벤트에서 이 쿼리를 invalidate 한다 (useChatRealtimeSync)
 * - 새 방 자체가 생기는 것(견적 확정)은 소켓 채널 밖이라, 그 알림(ESTIMATE_CONFIRMED)을 받았을 때도
 *   invalidate 한다 (useNotificationStream)
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
 * - 포커스·재연결·재마운트로 통째로 다시 받지 않는다. infinite query를 다시 받으면
 *   첫 페이지가 최신 N개로 바뀌어 이전 메시지가 사라지거나 페이지 사이에 구멍이 생긴다.
 *   새 메시지·읽음은 socket 이벤트와 refreshLatestChatMessages가 캐시에 합친다
 */
export function useChatMessagesQuery(estimateId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(estimateId),
    queryFn: ({ pageParam }) =>
      getChatMessages(estimateId, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
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
