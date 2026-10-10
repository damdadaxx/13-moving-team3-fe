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
      // 플로팅 버튼의 채팅방 목록(마지막 메시지 미리보기)도 같이 갱신
      void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

/** 읽음 처리
 * - 성공 시 이 채팅방의 안 읽은 메시지 수와, 플로팅 버튼 배지(채팅방 목록) 캐시를 무효화한다
 */
export function useReadChatMessagesMutation(estimateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => readChatMessages(estimateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: chatKeys.unreadCount(estimateId),
      });
      void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
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
