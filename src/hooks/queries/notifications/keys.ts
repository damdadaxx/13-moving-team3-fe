export const notificationKeys = {
  all: ['notifications'] as const,
  list: () =>
    [...notificationKeys.all, 'list'] as const /* 알림 목록 쿼리 키 */,
  unreadCount: () =>
    [
      ...notificationKeys.all,
      'unread-count',
    ] as const /* 알림 뱃지 캐시 쿼리 키 */,
};
