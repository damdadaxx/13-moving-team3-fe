// 리뷰 API 호출 함수
import type {
  MoverReviewListData,
  MoverReviewListQuery,
  CreateReviewInput,
  GetMyReviewsParams,
  MyReviewListData,
  ReviewSummary,
  CreateReviewDraftInput,
} from '@/types/review';

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

/*
@ GET /reviews/me
- 이사 완료(COMPLETED) + 확정(ACCEPTED) 견적만 온다
- hasReview=false: 작성 가능한 리뷰
- hasReview=true: 내가 작성한 리뷰
- sort=reviewDate: 리뷰 작성일 기준 정렬
- sort=moveDate: 이사 완료일 기준 정렬
*/
export async function getMyReviews({
  page,
  pageSize,
  hasReview,
  sort,
}: GetMyReviewsParams): Promise<MyReviewListData> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  params.set('hasReview', hasReview ? 'true' : 'false');
  if (sort) params.set('sort', sort);

  return clientFetch<MyReviewListData>(
    `${ENDPOINTS.review.mine}?${params.toString()}`,
  );
}

/*
@ POST /reviews
- 견적당 리뷰 1개. 본인 완료 견적만 작성할 수 있다
*/
export async function createReview(
  input: CreateReviewInput,
): Promise<ReviewSummary> {
  return clientFetch<ReviewSummary>(ENDPOINTS.review.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/*
@ POST /reviews/draft
- 리뷰 초안 작성
*/
export async function createReviewDraft(
  input: CreateReviewDraftInput,
  signal?: AbortSignal,
): Promise<ReviewSummary> {
  return clientFetch<ReviewSummary>(ENDPOINTS.review.draft, {
    method: 'POST',
    body: JSON.stringify(input),
    signal,
  });
}
