import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { fetchMoverReviews, getMyReviews } from '@/lib/api/review';

import { reviewKeys } from '@/hooks/queries/reviews/keys';

export const MOVER_REVIEW_PAGE_SIZE = 5;
export const PENDING_REVIEWS_PAGE_SIZE = 4;

/** @ 기사님 리뷰 목록 쿼리 */
export function useMoverReviewsQuery(moverId: string, page: number) {
  return useQuery({
    queryKey: reviewKeys.byMover(moverId, {
      page,
      pageSize: MOVER_REVIEW_PAGE_SIZE,
    }),
    queryFn: () =>
      fetchMoverReviews(moverId, {
        page,
        pageSize: MOVER_REVIEW_PAGE_SIZE,
      }),
    enabled: Boolean(moverId),
    /** 이전 데이터를 반환하여 데이터가 없을 때 이전 데이터를 표시 */
    placeholderData: (previousData, previousQuery) => {
      const previousMoverId = previousQuery?.queryKey[2];
      if (previousMoverId !== moverId) return undefined;
      return previousData;
    },
    meta: { name: '기사님 리뷰 목록' },
  });
}

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
