// 견적 API 호출 함수
import type {
  CreateEstimateInput,
  CreateEstimateResponse,
  ReceivedRequestListResponse,
  ReceivedRequestQuery,
  UpdateEstimateStatusInput,
  UpdateEstimateStatusResponse,
} from '@/types/estimate';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ GET /estimate-requests/received - 기사님이 받은 요청 목록
- serviceTypes/regions는 콤마로 나열해서 보낸다 (백엔드가 콤마·반복 모두 지원하지만 콤마로 통일)
- keyword가 빈 문자열이면 아예 보내지 않는다 (백엔드는 빈 문자열도 "검색 안 함"으로 처리하지만 굳이 보낼 필요 없음)
*/
export async function getReceivedRequests(
  query: ReceivedRequestQuery = {},
): Promise<ReceivedRequestListResponse> {
  const params = new URLSearchParams();

  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.serviceTypes?.length) {
    params.set('serviceTypes', query.serviceTypes.join(','));
  }
  if (query.regions?.length) params.set('regions', query.regions.join(','));
  if (query.keyword) params.set('keyword', query.keyword);
  if (query.isDesignated !== undefined) {
    params.set('isDesignated', String(query.isDesignated));
  }
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.size !== undefined) params.set('size', String(query.size));

  const queryString = params.toString();
  const url = queryString
    ? `${ENDPOINTS.estimate.received}?${queryString}`
    : ENDPOINTS.estimate.received;

  return clientFetch<ReceivedRequestListResponse>(url);
}

/*
@ POST /estimates - 견적 보내기 (지정 없이)
- 지정(isDesignated) 없는 PENDING 요청 전용이다. 지정 건은 estimateId가 필요한
  PATCH /estimates/{estimateId}로 처리해야 해서 이 함수로는 보낼 수 없다
*/
export async function createEstimate(
  input: CreateEstimateInput,
): Promise<CreateEstimateResponse> {
  return clientFetch<CreateEstimateResponse>(ENDPOINTS.estimate.list, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/*
@ PATCH /estimates/{estimateId} - 견적 상태 전환 (발송/반려)
- 지정(DESIGNATED) 건 전용이다
*/
export async function updateEstimateStatus(
  estimateId: string,
  input: UpdateEstimateStatusInput,
): Promise<UpdateEstimateStatusResponse> {
  return clientFetch<UpdateEstimateStatusResponse>(
    ENDPOINTS.estimate.update(estimateId),
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}
