// 견적/견적 요청 관련 타입
import type { ServiceType } from '@/types/serviceType';

import type { Region } from '@/components/ui/Chip/RegionChipGroup';

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
