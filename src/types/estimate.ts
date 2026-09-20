/*
@ 견적 관련 타입
- 백엔드 Prisma enum / API 응답과 이름·단위를 그대로 맞춘다.
- 화면 표기로 바꾸는 일은 utils(formatRegion, formatMoverStats, formatDate)가 맡는다.
*/
import type { Region } from '@/types/region';
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
  userId?: string;
  moverId?: string;
  nickname: string;
  imgUrl: string | null;
  /** 경력 개월 수 */
  careerMonths: number;
  user?: { name: string };
  reviewCount?: number;
  /** 평균 평점. 리뷰가 없으면 null */
  averageRating?: number | null;
  /** 확정(ACCEPTED)된 견적 건수 */
  confirmedEstimateCount?: number;
  confirmedCount?: number;
  /** 찜 받은 수 */
  likeCount?: number;
  isLiked?: boolean;
}

/** 기사님이 보낸 견적서 한 건 */
export interface Estimate {
  id?: string;
  estimateId?: string;
  /** DESIGNATED 상태(금액 전)는 null */
  price: number | null;
  comment: string | null;
  isDesignated: boolean;
  status: EstimateStatus;
  rejectReason: string | null;
  createdAt?: string;
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

/*
@ TODO: 진행 중 견적 요청 타입 이름 통일
- EstimateRequestDetail은 ActiveEstimateRequest와 같다
- 호출부를 한쪽으로 맞춘 뒤 별칭을 제거한다
*/
export type EstimateRequestDetail = ActiveEstimateRequest;

/** PATCH /estimates/:estimateId 응답 (고객 확정) */
export interface UpdateEstimateStatusResult {
  estimateId: string;
  estimateRequestId: string;
  status: EstimateStatus;
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

/** 목록 응답에 실리는 견적 요청 요약 (받았던 견적) */
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

export interface ReceivedEstimateListResponse {
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
