// 견적/견적 요청 관련 타입
// 백엔드 estimate-request 모듈의 요청/응답 스키마를 따른다.
import type { ServiceType } from '@/types/serviceType';

import type { Region } from '@/types/region';

export type EstimateRequestStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'EXPIRED';

export type EstimateStatus =
  | 'PROPOSED'
  | 'DESIGNATED'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'NOT_SELECTED'
  | 'EXPIRED';

/** POST /estimate-requests 요청 본문 (백엔드 createEstimateRequestSchema) */
export interface CreateEstimateRequestInput {
  serviceType: ServiceType;
  /** 오늘 이후만 허용된다. 백엔드가 moveDate <= now 를 거부한다 */
  moveDate: Date;
  /** 5자리 숫자 문자열. "04538"처럼 앞자리 0을 보존해야 해서 string이다 */
  departureZipCode: string;
  /** 5~200자 */
  departureAddress: string;
  arrivalZipCode: string;
  arrivalAddress: string;
}

/**
 * 생성된 견적 요청.
 * 백엔드는 조회 API와 같은 구조로 돌려주지만, 지금 화면이 쓰는 필드만 적어 둔다.
 */
export interface EstimateRequest {
  id: string;
  serviceType: ServiceType;
  moveDate: string;
  status: string;
}

interface EstimateMoverSummary {
  moverId?: string;
  userId?: string;
  nickname: string;
}

export interface EstimateSummary {
  estimateId?: string;
  id?: string;
  isDesignated: boolean;
  status: EstimateStatus;
  mover: EstimateMoverSummary;
}

/*
@ 진행 중인 견적 요청 (GET /estimate-requests/active)
- 없으면 data가 null
*/
export interface EstimateRequestDetail {
  id: string;
  customerId: string;
  serviceType: ServiceType;
  moveDate: string;
  departureAddress: string;
  arrivalAddress: string;
  status: EstimateRequestStatus;
  estimates: EstimateSummary[];
}

/*
@ TODO: 진행 중 견적 요청 타입 이름 통일
- ActiveEstimateRequest는 EstimateRequestDetail과 같다
- 호출부를 EstimateRequestDetail로 맞춘 뒤 이 별칭을 제거한다
- EstimateRequest.status도 EstimateRequestStatus로 맞춘다
*/
export type ActiveEstimateRequest = EstimateRequestDetail;

/*
@ 지정 견적 생성 응답 (POST /estimate-requests/{id}/estimates)
*/
export interface DesignatedEstimate {
  id: string;
  isDesignated: boolean;
  status: Extract<EstimateStatus, 'DESIGNATED'>;
  mover: {
    userId: string;
    nickname: string;
    user: { name: string };
  };
}

/*
@ GET /estimate-requests/received - 기사님이 받은 요청 목록
- 커서 기반 무한 스크롤. sortBy/serviceTypes/regions/keyword/isDesignated로 필터링한다
- "자격"(내 서비스 종류·지역)은 서버가 판정하고, "지정" 견적은 자격과 무관하게 보인다
*/
export type ReceivedRequestSortBy = 'moveDate' | 'createdAt';

export interface ReceivedRequestQuery {
  sortBy?: ReceivedRequestSortBy;
  serviceTypes?: ServiceType[];
  regions?: Region[];
  keyword?: string;
  isDesignated?: boolean;
  cursor?: string;
  size?: number;
}

export interface ReceivedRequestCustomer {
  customerId: string;
  name: string;
  region: Region;
}

export interface ReceivedRequestItem {
  /** 지정이 아닌 요청에 견적을 보낼 때 쓰는 키(POST /estimates)이자 커서 값 */
  estimateRequestId: string;
  /** 지정 견적일 때만 값이 있다. PATCH /estimates/{estimateId}(status: PROPOSED/REJECTED)에 쓴다 */
  estimateId: string | null;
  serviceType: ServiceType;
  moveDate: string;
  departureAddress: string;
  arrivalAddress: string;
  /** 고객이 견적을 요청한 시각(createdAt) */
  requestedAt: string;
  isDesignated: boolean;
  customer: ReceivedRequestCustomer;
}

export interface ReceivedRequestListResponse {
  list: ReceivedRequestItem[];
  nextCursor: string | null;
  totalCount: number;
}

/*
@ POST /estimates - 견적 보내기 (지정 없이)
- 지정(isDesignated) 없는 PENDING 요청 전용이다. 지정 건은 estimateId가 필요한
  PATCH /estimates/{estimateId}로 처리한다
*/
export interface CreateEstimateInput {
  estimateRequestId: string;
  price: number;
  comment: string;
}

export interface CreateEstimateResponse {
  estimateId: string;
  estimateRequestId: string;
  price: number;
  comment: string;
  isDesignated: boolean;
  status: string;
}

/*
@ PATCH /estimates/{estimateId} - 견적 상태 전환 (발송/반려/확정 중 기사님이 쓰는 건 발송·반려)
- DESIGNATED 건에만 쓸 수 있다. estimateId는 목록(GET /estimate-requests/received)에
  안 나오므로 GET /estimates?status=DESIGNATED로 따로 조회해 매칭한다
*/
export type UpdateEstimateStatusInput =
  | { status: 'PROPOSED'; price: number; comment: string }
  | { status: 'REJECTED'; rejectReason: string };

export interface UpdateEstimateStatusResponse {
  estimateId: string;
  estimateRequestId: string;
  status: string;
}
