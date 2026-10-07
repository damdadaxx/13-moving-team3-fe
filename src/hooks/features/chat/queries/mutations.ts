import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getChatImageUploadUrl,
  readChatMessages,
  sendChatMessage,
} from '@/lib/api/chat';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

/** 메시지 전송
 * - 성공 시 메시지 목록을 다시 받는다. 실시간 반영은 Supabase 구독이 담당하고,
 *   이건 보낸 사람 화면에 즉시 반영하기 위한 보강이다
 */
export function useSendChatMessageMutation(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChatMessage.bind(null, estimateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: chatKeys.messages(estimateId),
      });
    },
  });
}

/** 읽음 처리
 * - 성공 시 이 채팅방의 안 읽은 메시지 수 캐시를 무효화한다
 */
export function useReadChatMessagesMutation(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => readChatMessages(estimateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: chatKeys.unreadCount(estimateId),
      });
    },
  });
}

/** 이미지 업로드 presigned URL 발급
 * - 발급 즉시 소비되는 일회성 값이라 캐시 무효화 대상이 없다
 */
export function useChatImageUploadUrlMutation(estimateId: string) {
  return useMutation({
    mutationFn: (fileName: string) =>
      getChatImageUploadUrl(estimateId, fileName),
  });
}
