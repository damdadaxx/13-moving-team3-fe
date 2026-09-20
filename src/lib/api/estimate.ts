// 견적 요청 API 호출 함수
// 브라우저는 프록시(/api)만 사용한다.
import type {
  ActiveEstimateRequest,
  CreateEstimateRequestInput,
  EstimateListResponse,
  EstimateRequest,
  GetEstimatesParams,
} from '@/types/estimate';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ POST /estimate-requests
- 고객당 진행 중인 요청은 1건이라, 이미 있으면 백엔드가 409로 응답한다
- moveDate는 Date 그대로 두면 JSON 직렬화가 ISO 문자열로 바꿔주고,
  백엔드 z.coerce.date가 다시 Date로 받는다
*/
export async function createEstimateRequest(
  input: CreateEstimateRequestInput,
): Promise<EstimateRequest> {
  return clientFetch<EstimateRequest>(ENDPOINTS.estimate.request, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/*
@ GET /estimate-requests/active
- 고객당 진행 중인 요청은 최대 1건이라 경로에 id가 없다
- 진행 중인 요청이 없으면 data가 null이다 (에러가 아니다)
*/
export async function getActiveEstimateRequest(): Promise<ActiveEstimateRequest | null> {
  return clientFetch<ActiveEstimateRequest | null>(
    ENDPOINTS.estimate.activeRequest,
  );
}

/*
@ GET /estimates - 내 견적 목록 (요청 1건 + 그 요청의 견적서들)
- status: EstimateStatus 값을 콤마로 나열하거나 'closed' 한 단어
  - 'closed' = ACCEPTED,NOT_SELECTED,EXPIRED (내 견적 관리 > 받았던 견적)
  - 생략하면 고객에게 보여도 되는 상태 전부 (DESIGNATED·REJECTED 제외)
- cursor: 직전 응답의 nextCursor를 그대로 넘긴다 (견적 요청 단위 커서)
*/

/** 백엔드 paginationSchema의 기본 size와 맞춘다 */
export const ESTIMATE_PAGE_SIZE = 10;

export async function getEstimates(
  params: GetEstimatesParams = {},
): Promise<EstimateListResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return clientFetch<EstimateListResponse>(
    query ? `${ENDPOINTS.estimate.list}?${query}` : ENDPOINTS.estimate.list,
  );
}

/*
@ 기사님 프로필 이미지 URL
- 백엔드는 '/uploads/movers/xxx.webp' 같은 백엔드 기준 상대 경로를 저장한다
  → 프록시(/api)를 타도록 앞에 붙인다
- ponytail: S3로 바뀌어 절대 URL이 내려오면 next.config의 images.remotePatterns에
  그 도메인을 추가해야 next/image가 렌더한다
*/
export function resolveMoverImageUrl(imgUrl: string | null): string | null {
  if (!imgUrl) return null;
  if (imgUrl.startsWith('http')) return imgUrl;

  return `/api${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}
