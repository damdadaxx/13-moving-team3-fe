// 기사님 관련 상수 (이사 유형 / 지역 / 정렬 라벨)
import type { MoverSortBy, Region, ServiceType } from '@/types/mover';

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

export const MOVER_SORT_LABEL: Record<MoverSortBy, string> = {
  reviewCount: '리뷰 많은순',
  rating: '평점 높은순',
  career: '경력 높은순',
  confirmedCount: '확정 많은순',
};

/** 기사님 찾기 목록 한 번에 불러올 개수 */
export const MOVER_LIST_PAGE_SIZE = 10;
