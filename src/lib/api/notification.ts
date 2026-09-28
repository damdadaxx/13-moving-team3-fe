import type {
  Notification,
  NotificationList,
  NotificationListQuery,
  UnreadCount,
} from '@/types/notification';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

const DEFAULT_PAGE_SIZE = 10;

/*
@ GET /notifications
- 커서 기반. size 기본 10, 최대 50
*/
export function getNotifications(
  query: NotificationListQuery = {},
): Promise<NotificationList> {
  const params = new URLSearchParams();
  params.set('size', String(query.size ?? DEFAULT_PAGE_SIZE));
  if (query.cursor) params.set('cursor', query.cursor);

  return clientFetch<NotificationList>(
    `${ENDPOINTS.notification.list}?${params.toString()}`,
  );
}

/** GET /notifications/unread-count */
export function getUnreadCount(): Promise<UnreadCount> {
  return clientFetch<UnreadCount>(ENDPOINTS.notification.unreadCount);
}

/** PATCH /notifications/:id/read */
export function readNotification(id: string): Promise<Notification> {
  return clientFetch<Notification>(ENDPOINTS.notification.read(id), {
    method: 'PATCH',
  });
}

/** PATCH /notifications/read-all — Prisma updateMany 결과 { count } */
export function readAllNotifications(): Promise<{ count: number }> {
  return clientFetch<{ count: number }>(ENDPOINTS.notification.readAll, {
    method: 'PATCH',
  });
}
