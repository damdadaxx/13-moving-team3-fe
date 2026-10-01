// 견적/견적 요청 API 호출 함수
// 브라우저는 프록시(/api)만 사용한다.
import type {
  ActiveEstimateRequest,
  CreateEstimateInput,
  CreateEstimateRequestInput,
  CreateEstimateResponse,
  DesignatedEstimate,
  EstimateDetail,
  EstimateListResponse,
  EstimateRequest,
  MyEstimateListQuery,
  ReceivedRequestListResponse,
  ReceivedRequestQuery,
  UpdateEstimateStatusInput,
  UpdateEstimateStatusResponse,
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
  return clientFetch<EstimateRequest>(ENDPOINTS.estimateRequest.create, {
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
    ENDPOINTS.estimateRequest.active,
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

/*
@ GET /estimate-requests/received - 기사님이 받은 요청 목록
- serviceTypes/regions는 콤마로 나열해서 보낸다 (백엔드가 콤마·반복 모두 지원하지만 콤마로 통일)
- keyword가 빈 문자열이면 아예 보내지 않는다 (백엔드는 빈 문자열도 "검색 안 함"으로 처리하지만 굳이 보낼 필요 없음)
- isDesignated/isServiceArea는 'true'/'false' 문자열로 보내고, undefined면 생략한다
- "서비스 가능 지역" 매칭은 isServiceArea=true만 보내면 서버가 내 프로필 기준으로 처리한다 (regions로 프로필 지역을 보낼 필요 없음)
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
  if (query.isServiceArea !== undefined) {
    params.set('isServiceArea', String(query.isServiceArea));
  }
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.size !== undefined) params.set('size', String(query.size));

  const queryString = params.toString();
  const url = queryString
    ? `${ENDPOINTS.estimateRequest.received}?${queryString}`
    : ENDPOINTS.estimateRequest.received;

  return clientFetch<ReceivedRequestListResponse>(url);
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
    ENDPOINTS.estimateRequest.designatedEstimate(estimateRequestId),
    {
      method: 'POST',
      body: JSON.stringify({ moverId }),
    },
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
