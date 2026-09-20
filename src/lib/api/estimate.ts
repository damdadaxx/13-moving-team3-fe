// 견적 API 호출 함수
// 브라우저는 프록시(/api)만 사용. 쿠키는 clientFetch가 credentials: same-origin으로 전달한다
import type {
  ActiveEstimateRequest,
  CreateEstimateRequestInput,
  EstimateRequest,
  UpdateEstimateStatusResult,
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
- 고객당 진행 중인 요청은 최대 1건이라 경로에 id가 없다.
- 진행 중인 요청이 없으면 에러가 아니라 null이다.
- 응답의 estimates에는 아직 금액이 없는 지정 견적(DESIGNATED)과 반려(REJECTED)도 섞여 있다.
  목록에 뿌릴 때는 화면에서 상태로 걸러 쓴다.
*/
export async function getActiveEstimateRequest(): Promise<ActiveEstimateRequest | null> {
  return clientFetch<ActiveEstimateRequest | null>(
    ENDPOINTS.estimate.activeRequest,
  );
}

/*
@ PATCH /estimates/:estimateId
- 고객이 견적을 확정한다. 해당 견적이 PROPOSED일 때만 가능하다.
- 백엔드가 한 트랜잭션으로 나머지 견적을 NOT_SELECTED로, 요청을 CONFIRMED로 바꾸므로
  성공 후에는 진행 중인 요청 쿼리만 다시 읽으면 화면이 맞춰진다.
*/
export async function acceptEstimate(
  estimateId: string,
): Promise<UpdateEstimateStatusResult> {
  return clientFetch<UpdateEstimateStatusResult>(
    ENDPOINTS.estimate.update(estimateId),
    {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    },
  );
}
