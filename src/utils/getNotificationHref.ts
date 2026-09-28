import type { Notification } from '@/types/notification';
import type { Role } from '@/types/role';

import { ROUTES } from '@/lib/constants/routes';

/*
@ 알림 클릭 시 이동 경로
- targetPath는 견적 id
- NEW_REQUEST는 비어 있어서 받은 요청 목록으로 간다
- 새 견적은 아직 확정 전이라 대기 중인 견적 상세로 간다
*/
export default function getNotificationHref(
  role: Role,
  notification: Pick<Notification, 'type' | 'targetPath'>,
): string {
  const id = notification.targetPath;

  if (role === 'mover') {
    if (notification.type === 'NEW_REQUEST' || !id) return ROUTES.moverHome;
    return `${ROUTES.moverEstimates}/${id}`;
  }

  if (notification.type === 'NEW_ESTIMATE') {
    return id
      ? `${ROUTES.customerEstimatesPending}/${id}`
      : ROUTES.customerEstimatesPending;
  }

  return id ? `${ROUTES.customerEstimates}/${id}` : ROUTES.customerEstimates;
}
