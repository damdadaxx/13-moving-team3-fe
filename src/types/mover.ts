import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

export type { Region, ServiceType };

/** GET /mover 정렬 기준 (백엔드 getMoverListQuerySchema.sortBy) */
export type MoverSortBy =
  'reviewCount' | 'rating' | 'career' | 'confirmedCount';

export type MoverListSortBy = MoverSortBy;

/*
@ 기사님 카드 한 장에 필요한 값 (GET /mover 목록의 list 항목)
- 찜한 기사님(GET /likes/me)도 이 모양으로 변환해서 같은 카드를 쓴다
*/
export interface MoverListItem {
  id: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  serviceTypes: ServiceType[];
  serviceRegions?: Region[];
  averageRating: number;
  reviewCount: number;
  confirmedCount: number;
  likeCount: number;
}

export interface MoverListParams {
  keyword?: string;
  region?: Region;
  serviceType?: ServiceType;
  sortBy: MoverSortBy;
  cursor?: string;
  size?: number;
}

export interface CursorPage<T> {
  list: T[];
  nextCursor: string | null;
  totalCount: number;
}

/*
@ 기사님 상세 (GET /mover/{id})
- 목록 아이템에 소개글·생성일 필드가 추가된다
*/
export interface MoverDetail extends MoverListItem {
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type MoverListData = CursorPage<MoverListItem>;

export interface MoverListQuery {
  keyword?: string;
  region?: Region;
  serviceType?: ServiceType;
  sortBy?: MoverListSortBy;
  cursor?: string;
  size?: number;
}

/*
@ GET /mover/profile - 내 기사님 프로필 조회
*/
export interface MoverProfile {
  id: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: Region[];
  createdAt: string;
  updatedAt: string;
}
