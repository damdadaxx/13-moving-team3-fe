import { CreateReviewDraftVariables } from '@/types/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview, createReviewDraft } from '@/lib/api/review';

import {
  setAiUsage,
  syncAiUsageOnError,
} from '@/hooks/features/ai/queries/queries';
import { reviewKeys } from '@/hooks/features/review/queries/keys';

/*
@ 리뷰 작성
- 성공하면 작성 가능/작성 완료 목록과, 기사님 상세의 공개 리뷰를 다시 받는다
*/
export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

/*
@ 리뷰 초안 작성
*/
export function useCreateReviewDraftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ signal, ...input }: CreateReviewDraftVariables) =>
      createReviewDraft(input, signal),
    //응답에 오늘 남은 초안 횟수가 같이 온다. 다시 조회하지 않고 캐시만 고친다.
    onSuccess: ({ usage }) => setAiUsage(queryClient, 'reviewDraft', usage),
    onError: (error) => syncAiUsageOnError(queryClient, 'reviewDraft', error),
  });
}
