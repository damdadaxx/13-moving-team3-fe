// 견적 API 호출 함수
import type {
  EstimateDetail,
  EstimateListResponse,
  MyEstimateListQuery,
} from '@/types/estimate';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

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
