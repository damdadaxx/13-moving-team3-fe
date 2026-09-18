// 견적 관련 타입
import type { ServiceType } from '@/types/serviceType';

export type EstimateStatus =
  | 'PROPOSED'
  | 'DESIGNATED'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'NOT_SELECTED'
  | 'EXPIRED';

/*
@ GET /estimates - 내 견적 목록 조회 (커서 기반 무한 스크롤)
- 토큰의 role(CUSTOMER/MOVER)로 조회 관점이 결정된다. 응답은 항상 견적 요청 단위로 묶인다
- status 쿼리로 필터링한다 (콤마로 여러 개 나열 가능)
*/
export interface MyEstimateListQuery {
  status?: EstimateStatus | EstimateStatus[];
  serviceType?: ServiceType;
  cursor?: string;
  size?: number;
}

/** 견적 요청 1건의 요약 정보 (EstimateGroup.estimateRequest) */
export interface EstimateRequestInfo {
  estimateRequestId: string;
  serviceType: ServiceType;
  moveDate: string;
  departureZipCode: number;
  departureAddress: string;
  arrivalZipCode: number;
  arrivalAddress: string;
  requestedAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'EXPIRED';
}

/** 견적을 보낸 기사님 정보와 집계값 */
export interface MoverSummary {
  moverId: string;
  nickname: string;
  imgUrl: string | null;
  careerMonths: number;
  userId: string;
  user: { name: string };
  reviewCount: number;
  averageRating: number | null;
  confirmedEstimateCount: number;
  likeCount: number;
}

export interface CustomerSummary {
  name: string;
}

export interface EstimateSummary {
  estimateId: string;
  /** 금액 미입력(DESIGNATED)·반려(REJECTED) 건은 null */
  price: number | null;
  comment: string | null;
  /** 지정 견적 반려 사유 */
  rejectReason: string | null;
  isDesignated: boolean;
  status: EstimateStatus;
  createdAt: string;
  mover: MoverSummary;
}

export interface EstimateGroup {
  estimateRequest: EstimateRequestInfo;
  estimates: EstimateSummary[];
  /** 이 견적 요청에 달린 견적 개수 (estimates 배열 길이) */
  totalCount: number;
}

export interface EstimateListResponse {
  list: EstimateGroup[];
  nextCursor: string | null;
  /** 조건에 맞는 전체 견적 요청 건수 */
  totalCount: number;
}

/*
@ GET /estimates/{estimateId} - 견적 상세 조회
- 목록(GET /estimates)에는 없는 customer 정보가 여기에만 있다
*/
export interface EstimateDetail {
  estimateId: string;
  price: number | null;
  comment: string | null;
  rejectReason: string | null;
  isDesignated: boolean;
  status: EstimateStatus;
  createdAt: string;
  mover: MoverSummary;
  customer: CustomerSummary;
  estimateRequest: EstimateRequestInfo;
  /** CUSTOMER 관점 - 본인 요청 + 요청 PENDING + 견적 PROPOSED일 때만 true */
  canConfirm?: boolean;
  /** MOVER 관점 - 본인 견적 + 요청 PENDING + 견적 DESIGNATED일 때만 true */
  canRespond?: boolean;
}
