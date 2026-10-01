/*
@ 알림
- 백엔드 NotificationType / Notification 모델과 같다
- targetPath는 URL이 아니라 견적 id(uuid)다. 없으면 null
- createdAt은 JSON으로 넘어온 ISO 문자열
*/

export type NotificationType =
  'NEW_ESTIMATE' | 'NEW_REQUEST' | 'ESTIMATE_CONFIRMED' | 'MOVE_DAY';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  targetPath: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationList {
  list: Notification[];
  nextCursor: string | null;
  totalCount: number;
}

export interface NotificationListQuery {
  cursor?: string;
  size?: number;
}

export interface UnreadCount {
  unreadCount: number;
}
