// 견적 요청 API 호출 함수
// 브라우저는 프록시(/api)만 사용한다.
import type {
  ActiveEstimateRequest,
  CreateEstimateRequestInput,
  DesignatedEstimate,
  EstimateRequest,
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
@ TODO: 활성 견적 요청 조회 함수 이름 통일
- fetchActiveEstimateRequest는 지정 견적 쪽 호출을 위한 별칭이다
- hooks/queries/estimates를 getActiveEstimateRequest로 바꾼 뒤 이 별칭을 제거한다
- hooks/queries/estimate와 estimates 폴더·쿼리키도 하나로 합친다
*/
export const fetchActiveEstimateRequest = getActiveEstimateRequest;

/*
@ 지정 견적 요청 (POST /estimate-requests/{estimateRequestId}/estimates)
- body: { moverId }
- 요청 1건당 최대 3명까지 지정할 수 있다
*/
export function createDesignatedEstimate(
  estimateRequestId: string,
  moverId: string,
): Promise<DesignatedEstimate> {
  return clientFetch<DesignatedEstimate>(
    ENDPOINTS.estimate.estimates(estimateRequestId),
    {
      method: 'POST',
      body: JSON.stringify({ moverId }),
    },
  );
}
