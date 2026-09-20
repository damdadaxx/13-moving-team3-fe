/*
@ 견적 관련 타입
- 백엔드 Prisma enum / API 응답과 이름·단위를 그대로 맞춘다.
- 화면 표기로 바꾸는 일은 utils(formatRegion, formatMoverStats, formatDate)가 맡는다.
*/
import type { ServiceType } from '@/types/serviceType';

/** 견적 요청의 상태 (Prisma EstimateRequestStatus) */
export type EstimateRequestStatus =
  | 'PENDING' // 견적 대기 - 확정 전
  | 'CONFIRMED' // 확정 완료 - 이사일 대기
  | 'COMPLETED' // 이사일 경과
  | 'EXPIRED'; // 확정 없이 이사일 경과

/** 견적서 한 건의 상태 (Prisma EstimateStatus) */
export type EstimateStatus =
  | 'REJECTED' // 지정 견적 반려
  | 'DESIGNATED' // 지정 견적 요청 - 기사님이 아직 금액을 안 보냄
  | 'PROPOSED' // 견적대기 - 기사님이 보냄
  | 'ACCEPTED' // 확정 견적 - 고객이 확정
  | 'NOT_SELECTED' // 다른 견적 확정으로 탈락
  | 'EXPIRED'; // 확정 없이 이사일 경과

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
  status: EstimateRequestStatus;
}

/** 견적서에 딸려오는 기사님 정보 (집계값 포함) */
export interface EstimateMover {
  userId: string;
  nickname: string;
  imgUrl: string | null;
  /** 경력 개월 수 */
  careerMonths: number;
  user: { name: string };
  reviewCount: number;
  /** 평균 평점. 리뷰가 없으면 null */
  averageRating: number | null;
  /** 확정(ACCEPTED)된 견적 건수 */
  confirmedEstimateCount: number;
  /** 찜 받은 수 */
  likeCount: number;
}

/** 기사님이 보낸 견적서 한 건 */
export interface Estimate {
  id: string;
  /** DESIGNATED 상태(금액 전)는 null */
  price: number | null;
  comment: string | null;
  isDesignated: boolean;
  status: EstimateStatus;
  rejectReason: string | null;
  mover: EstimateMover;
}

/**
 * GET /estimate-requests/active - 진행 중인 견적 요청 + 받은 견적 목록.
 * 진행 중인 요청이 없으면 null이 온다.
 */
export interface ActiveEstimateRequest {
  id: string;
  customerId: string;
  serviceType: ServiceType;
  /** 이사일 (ISO 8601) */
  moveDate: string;
  /** 출발지 도로명 주소 원문 */
  departureAddress: string;
  /** 도착지 도로명 주소 원문 */
  arrivalAddress: string;
  status: EstimateRequestStatus;
  /** 견적 신청일 (ISO 8601) */
  createdAt: string;
  /** 지금까지 받은 견적. 생성 직후에는 빈 배열 */
  estimates: Estimate[];
}

/** PATCH /estimates/:estimateId 응답 */
export interface UpdateEstimateStatusResult {
  estimateId: string;
  estimateRequestId: string;
  status: EstimateStatus;
}
