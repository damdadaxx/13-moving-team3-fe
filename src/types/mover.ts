// 기사님 프로필 관련 타입
import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

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

/*
@ 기사님 목록 아이템 (GET /mover)
- 스웨거 MoverListItem과 동일한 필드
- imgUrl은 프로필이 없으면 null
*/
export interface MoverListItem {
  id: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  serviceTypes: ServiceType[];
  serviceRegions: Region[];
  averageRating: number;
  reviewCount: number;
  confirmedCount: number;
  likeCount: number;
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

export interface MoverListData {
  list: MoverListItem[];
  nextCursor: string | null;
  totalCount: number;
}

export type MoverListSortBy =
  'reviewCount' | 'rating' | 'career' | 'confirmedCount';

export interface MoverListQuery {
  keyword?: string;
  region?: Region;
  serviceType?: ServiceType;
  sortBy?: MoverListSortBy;
  cursor?: string;
  size?: number;
}
