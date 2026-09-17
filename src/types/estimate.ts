// 견적 관련 타입
// 백엔드 estimate-request 모듈의 요청/응답 스키마를 따른다.
import type { ServiceType } from '@/types/serviceType';

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

/**
 * 진행 중인 견적 요청 (GET /estimate-requests/active).
 * 진행 중인 요청이 없으면 null이 온다.
 */
export interface ActiveEstimateRequest {
  id: string;
  customerId: string;
  serviceType: ServiceType;
  moveDate: string;
  status: string;
  departureAddress: string;
  arrivalAddress: string;
  /** 지금까지 받은 견적. 생성 직후에는 빈 배열 */
  estimates: unknown[];
}
