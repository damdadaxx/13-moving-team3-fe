import { useQuery } from '@tanstack/react-query';

import { fetchMoverReviews } from '@/lib/api/review';

import { reviewKeys } from '@/hooks/queries/reviews/keys';

export const MOVER_REVIEW_PAGE_SIZE = 5;

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
