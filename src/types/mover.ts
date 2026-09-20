/*
@ 백엔드 prisma enum
- ServiceType: 제공 서비스(이사 유형)
- Region: 서비스 가능 지역 (17개)
*/
export type ServiceType = 'SMALL_MOVE' | 'HOME_MOVE' | 'OFFICE_MOVE';

export type Region =
  | 'SEOUL'
  | 'GYEONGGI'
  | 'INCHEON'
  | 'GANGWON'
  | 'CHUNGBUK'
  | 'CHUNGNAM'
  | 'SEJONG'
  | 'DAEJEON'
  | 'JEONBUK'
  | 'JEONNAM'
  | 'GWANGJU'
  | 'GYEONGBUK'
  | 'GYEONGNAM'
  | 'DAEGU'
  | 'ULSAN'
  | 'BUSAN'
  | 'JEJU';

/** GET /mover 정렬 기준 (백엔드 getMoverListQuerySchema.sortBy) */
export type MoverSortBy =
  'reviewCount' | 'rating' | 'career' | 'confirmedCount';

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
