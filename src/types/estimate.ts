// 견적 관련 타입
// 백엔드 estimate-request 모듈의 요청/응답 스키마를 따른다.
import type { ServiceType } from '@/types/serviceType';

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
