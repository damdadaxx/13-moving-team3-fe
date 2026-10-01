import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getNotifications, getUnreadCount } from '@/lib/api/notification';

import { notificationKeys } from '@/hooks/features/notification/queries/keys';

/** 안 읽은 알림 수
 * - 로그인 후에만 조회
 */
export function useUnreadCountQuery(enabled: boolean) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadCount,
    enabled,
    meta: { name: '안 읽은 알림 수' },
  });
}

/** 알림 목록
 * - 드롭다운이 열려 있을 때만 조회
 */
export function useNotificationsQuery(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) => getNotifications({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    meta: { name: '알림 목록' },
  });
}
