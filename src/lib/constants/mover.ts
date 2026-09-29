// 기사님 관련 상수 (이사 유형 / 지역 / 정렬 라벨)
import type { MoverListSortBy } from '@/types/mover';
import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  SMALL_MOVE: '소형이사',
  HOME_MOVE: '가정이사',
  OFFICE_MOVE: '사무실이사',
};

/** 순서는 백엔드 Region enum = Figma 지역 드롭다운 표시 순서 */
export const REGION_LABEL: Record<Region, string> = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  SEJONG: '세종',
  DAEJEON: '대전',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GWANGJU: '광주',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  DAEGU: '대구',
  ULSAN: '울산',
  BUSAN: '부산',
  JEJU: '제주',
};

export const MOVER_SORT_LABEL: Record<MoverListSortBy, string> = {
  reviewCount: '리뷰 많은순',
  rating: '평점 높은순',
  career: '경력 높은순',
  confirmedCount: '확정 많은순',
};

/** 기사님 찾기 목록 한 번에 불러올 개수 */
export const MOVER_LIST_PAGE_SIZE = 10;

/*
@ 찜한 기사님 목록 한 번에 요청하는 개수
- 데스크톱 사이드바와 목록 하트 활성화에 같은 응답을 쓴다
- 백엔드 likes/me size 상한(50)과 맞춘다
*/
export const LIKED_MOVER_ID_PAGE_SIZE = 50;
