// 견적/견적 요청 API 호출 함수
// 브라우저는 프록시(/api)만 사용한다.
import type {
  ActiveEstimateRequest,
  CreateEstimateRequestInput,
  EstimateDetail,
  EstimateListResponse,
  EstimateRequest,
  MyEstimateListQuery,
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
@ GET /estimates - 내 견적 목록 조회 (커서 기반 무한 스크롤)
- status는 콤마로 나열해서 보낸다
*/
export async function getMyEstimates(
  query: MyEstimateListQuery = {},
): Promise<EstimateListResponse> {
  const params = new URLSearchParams();

  if (query.status) {
    const status = Array.isArray(query.status)
      ? query.status.join(',')
      : query.status;
    params.set('status', status);
  }
  if (query.serviceType) params.set('serviceType', query.serviceType);
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.size !== undefined) params.set('size', String(query.size));

  const queryString = params.toString();
  const url = queryString
    ? `${ENDPOINTS.estimate.list}?${queryString}`
    : ENDPOINTS.estimate.list;

  return clientFetch<EstimateListResponse>(url);
}

/*
@ GET /estimates/{estimateId} - 견적 상세 조회
- 목록에는 없는 customer(고객) 정보를 얻는 용도로 쓴다
*/
export async function getEstimateDetail(
  estimateId: string,
): Promise<EstimateDetail> {
  return clientFetch<EstimateDetail>(ENDPOINTS.estimate.detail(estimateId));
}
