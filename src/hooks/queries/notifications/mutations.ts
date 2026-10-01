import { useMutation, useQueryClient } from '@tanstack/react-query';

import { readAllNotifications, readNotification } from '@/lib/api/notification';

import { notificationKeys } from '@/hooks/queries/notifications/keys';

/** 알림 목록 캐시 무효화
 * - 알림 목록 쿼리와 뱃지 캐시를 무효화하여 새로운 알림을 받을 수 있게 함
 */
function useInvalidateNotifications() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

/** 알림 읽음 처리 */
export function useReadNotificationMutation() {
  const invalidate = useInvalidateNotifications();

  return useMutation({
    mutationFn: readNotification,
    onSuccess: invalidate,
  });
}

/** 알림 모두 읽음 처리 */
export function useReadAllNotificationsMutation() {
  const invalidate = useInvalidateNotifications();

  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: invalidate,
  });
}
