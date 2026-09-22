// 리뷰 API 호출 함수
// 브라우저는 프록시(/api)만 사용한다.
import type {
  CreateReviewInput,
  GetMyReviewsParams,
  MyReviewListData,
  ReviewSummary,
} from '@/types/review';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ GET /reviews/me
- 이사 완료(COMPLETED) + 확정(ACCEPTED) 견적만 온다
- hasReview=false: 작성 가능한 리뷰
- hasReview=true: 내가 작성한 리뷰
*/
export async function getMyReviews({
  page,
  pageSize,
  hasReview,
}: GetMyReviewsParams): Promise<MyReviewListData> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  params.set('hasReview', hasReview ? 'true' : 'false');

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
