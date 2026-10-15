import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview, createReviewDraft } from '@/lib/api/review';

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
  return useMutation({
    mutationFn: createReviewDraft,
  });
}
