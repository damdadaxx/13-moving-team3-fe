import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getMyReviews } from '@/lib/api/reviews';

import { reviewKeys } from '@/hooks/queries/reviews/keys';

export const PENDING_REVIEWS_PAGE_SIZE = 4;

/*
@ 작성 가능한 리뷰 목록
- GET /reviews/me?hasReview=false
- 페이지를 넘겨도 이전 목록을 잠깐 보여 주려고 keepPreviousData를 쓴다
*/
export function usePendingReviewsQuery(page: number) {
  return useQuery({
    queryKey: reviewKeys.pending(page, PENDING_REVIEWS_PAGE_SIZE),
    queryFn: () =>
      getMyReviews({
        page,
        pageSize: PENDING_REVIEWS_PAGE_SIZE,
        hasReview: false,
      }),
    placeholderData: keepPreviousData,
    meta: { name: '작성 가능한 리뷰 목록' },
  });
}
