// 주소 문자열의 시·도를 지역값(Region)으로 바꾸는 유틸
import type { Region } from '@/types/region';

/*
@ 시·도 접두어 → 지역값
- 주소 첫 조각(시·도)이 아래 접두어로 시작하면 그 지역으로 본다
- 카카오 도로명 주소는 '서울', '경기'처럼 줄여 쓰고, 정식 주소는 '서울특별시', '충청북도'로 온다
  → 줄임말과 정식 이름 앞부분을 함께 둔다 ('충청북도'는 '충청'만으로는 충북/충남을 가릴 수 없다)
- '경기 광주시'처럼 시·군·구에 다른 시·도 이름이 들어 있어도 첫 조각만 보므로 섞이지 않는다
*/
const REGION_PREFIXES: Record<Region, readonly string[]> = {
  SEOUL: ['서울'],
  BUSAN: ['부산'],
  DAEGU: ['대구'],
  INCHEON: ['인천'],
  DAEJEON: ['대전'],
  ULSAN: ['울산'],
  SEJONG: ['세종'],
  GYEONGGI: ['경기'],
  GANGWON: ['강원'],
  CHUNGBUK: ['충북', '충청북'],
  CHUNGNAM: ['충남', '충청남'],
  JEONBUK: ['전북', '전라북'],
  JEONNAM_GWANGJU: ['전남', '전라남', '광주'],
  GYEONGBUK: ['경북', '경상북'],
  GYEONGNAM: ['경남', '경상남'],
  JEJU: ['제주'],
};

const REGION_ENTRIES = Object.entries(REGION_PREFIXES) as [
  Region,
  readonly string[],
][];

/**
 * 주소의 시·도를 지역값으로 바꾼다.
 *
 * @param {string | null | undefined} address - 도로명 또는 지번 주소
 * @returns {Region | null} 지역값. 주소가 비었거나 시·도를 알 수 없으면 null
 *
 * @example
 * addressToRegion('서울 강남구 테헤란로 152');      // 'SEOUL'
 * addressToRegion('충청북도 청주시 상당구 상당로 82'); // 'CHUNGBUK'
 * addressToRegion('경기 광주시 경안로 1');           // 'GYEONGGI'
 */
export function addressToRegion(
  address: string | null | undefined,
): Region | null {
  const sido = address?.trim().split(/\s+/)[0];
  if (!sido) return null;

  const match = REGION_ENTRIES.find(([, prefixes]) =>
    prefixes.some((prefix) => sido.startsWith(prefix)),
  );

  return match ? match[0] : null;
}
