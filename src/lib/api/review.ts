import type { MoverReviewListData, MoverReviewListQuery } from '@/types/review';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** 기사님 리뷰 목록 조회 쿼리 파라미터 변환
 * @param query 기사님 리뷰 목록 조회 쿼리
 * @returns 기사님 리뷰 목록 조회 쿼리 파라미터
 */
function toSearchParams(query: MoverReviewListQuery): string {
  const params = new URLSearchParams();

  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));

  const search = params.toString();
  return search ? `?${search}` : '';
}

/*
@ 기사님 리뷰 목록 조회 (GET /reviews/mover/{moverId})
- 비회원도 호출할 수 있는 공개 API
*/
export function fetchMoverReviews(
  moverId: string,
  query: MoverReviewListQuery = {},
): Promise<MoverReviewListData> {
  return clientFetch<MoverReviewListData>(
    `${ENDPOINTS.review.byMover(moverId)}${toSearchParams(query)}`,
  );
}
