import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview } from '@/lib/api/reviews';

import { reviewKeys } from '@/hooks/queries/reviews/keys';

/*
@ 리뷰 작성
- 성공하면 작성 가능/작성 완료 목록을 다시 받는다
*/
export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
    },
  });
}
