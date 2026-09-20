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

/*=================================================
내 견적 목록 (GET /estimates)
백엔드 estimateMapper.toEstimateListItem과 prisma enum을 따른다.
=================================================*/

/** prisma EstimateStatus. 고객 응답에는 DESIGNATED·REJECTED가 오지 않는다 */
export type EstimateStatus =
  | 'REJECTED' // 지정 견적 반려
  | 'DESIGNATED' // 지정 견적 요청
  | 'PROPOSED' // 견적대기 - 기사님이 보냄
  | 'ACCEPTED' // 확정견적 - 고객이 확정
  | 'NOT_SELECTED' // 다른 견적 확정으로 탈락
  | 'EXPIRED'; // 확정 없이 이사일 경과

/** prisma EstimateRequestStatus */
export type EstimateRequestStatus =
  'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'EXPIRED';

/*
@ 견적서에 딸린 기사님 정보
- 목록 응답(toEstimateListItem)은 moverId·nickname·imgUrl·careerMonths만 내려준다
- 별점/리뷰수/확정건수/찜은 아직 목록 응답에 없어서 optional로 둔다.
  백엔드가 기사님 찾기 목록(moverMapper.toListItem)처럼 집계를 붙여주면
  카드가 자동으로 그 값을 보여준다
*/
export interface EstimateMover {
  moverId: string;
  nickname: string;
  imgUrl: string | null;
  careerMonths: number;
  averageRating?: number;
  reviewCount?: number;
  confirmedCount?: number;
  likeCount?: number;
  isLiked?: boolean;
}

export interface Estimate {
  estimateId: string;
  price: number | null;
  comment: string | null;
  rejectReason: string | null;
  isDesignated: boolean;
  status: EstimateStatus;
  createdAt: string;
  mover: EstimateMover;
}

/** 목록 응답에 실리는 견적 요청 요약 */
export interface EstimateRequestSummary {
  estimateRequestId: string;
  serviceType: ServiceType;
  /** 이용일 */
  moveDate: string;
  departureZipCode: string;
  departureAddress: string;
  arrivalZipCode: string;
  arrivalAddress: string;
  /** 견적 요청일 */
  requestedAt: string;
  status: EstimateRequestStatus;
}

/** 견적 요청 1건 + 그 요청으로 받은 견적서 목록 */
export interface EstimateListItem {
  estimateRequest: EstimateRequestSummary;
  estimates: Estimate[];
  totalCount: number;
}

export interface EstimateListResponse {
  list: EstimateListItem[];
  /** 다음 페이지 커서. 더 없으면 null */
  nextCursor: string | null;
  /** 조건에 맞는 견적 요청 전체 수 */
  totalCount: number;
}

export interface GetEstimatesParams {
  status?: string;
  serviceType?: ServiceType;
  cursor?: string;
  size?: number;
}

/*
@ 견적서 상태 필터 (내 견적 관리 화면의 드롭다운)
- 서버에 다시 묻지 않고 이미 받아온 견적서 배열만 거르는 화면 전용 값이다
- CONFIRMED = ACCEPTED, PENDING = 그 외(NOT_SELECTED·EXPIRED)
*/
export type EstimateStatusFilter = 'ALL' | 'CONFIRMED' | 'PENDING';
