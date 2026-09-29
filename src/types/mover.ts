// 기사님 프로필 관련 타입
import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

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
  /** 카드의 회색 설명 한 줄. 백엔드 목록 API가 함께 내려준다 */
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: Region[];
  /** 로그인한 고객이 이 기사님을 찜했는지. 비회원·기사님·미찜이면 없거나 false */
  isLiked?: boolean;
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

/*=================================================
기사님 찾기 페이지에서 쓰는 별칭 / 추가 타입
- dev의 타입을 그대로 두고 이름만 이어 붙인다 (MoverListQuery ↔ MoverListParams 등)
- 정리 여유가 생기면 dev 이름으로 통일하고 이 블록을 지운다
=================================================*/

// 목록 컴포넌트들이 '@/types/mover'에서 가져다 쓰므로 여기서도 내보낸다
export type { Region } from '@/types/region';
export type { ServiceType } from '@/types/serviceType';

/** dev의 MoverListSortBy와 같은 값 */
export type MoverSortBy = MoverListSortBy;

/** 목록 훅은 정렬을 항상 지정하므로 sortBy를 필수로 좁힌다 */
export type MoverListParams = MoverListQuery & { sortBy: MoverListSortBy };

/** 커서 페이지네이션 공통 형태. 찜한 기사님 목록에도 쓴다 */
export interface CursorPage<T> {
  list: T[];
  nextCursor: string | null;
  totalCount: number;
}
