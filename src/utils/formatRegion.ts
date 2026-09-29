// 도로명 주소를 화면용 지역 표기로 줄이는 유틸

/*
@ 시·도 표기
- 시안은 '서울시', '경기도'로 적혀 있는데 주소에 들어오는 시·도 이름은 출처마다 다르다.
  카카오 도로명 주소는 '서울', '경기'처럼 줄여 쓰고, 정식 주소는 '서울특별시', '경기도'로 온다.
- 줄임말은 아래 표로, 정식 이름은 접미사 규칙(SIDO_SUFFIX)으로 처리한다.
  '전북특별자치도'처럼 규칙으로 안 풀리는 것만 표에 함께 넣는다.
*/
const SIDO_LABELS: Record<string, string> = {
  서울: '서울시',
  부산: '부산시',
  대구: '대구시',
  인천: '인천시',
  광주: '광주시',
  대전: '대전시',
  울산: '울산시',
  세종특별자치시: '세종시',
  경기: '경기도',
  강원: '강원도',
  강원특별자치도: '강원도',
  충북: '충청북도',
  충남: '충청남도',
  전북: '전라북도',
  전남: '전라남도',
  경북: '경상북도',
  경남: '경상남도',
  제주: '제주도',
  // 규칙(특별자치도 -> 도)으로는 '전북도'가 되어버려 따로 둔다
  전북특별자치도: '전라북도',
};

/*
@ 정식 이름 접미사 정리
- 서울특별시 -> 서울시 / 부산광역시 -> 부산시 / 세종특별자치시 -> 세종시
- 제주특별자치도 -> 제주도 / 강원특별자치도 -> 강원도
- 경기도, 충청북도처럼 이미 짧은 이름은 그대로 남는다
*/
const SIDO_SUFFIX = /(특별자치시|특별시|광역시)$|(특별자치도)$/;

function toSidoLabel(sido: string): string {
  const mapped = SIDO_LABELS[sido];
  if (mapped) return mapped;

  return sido.replace(SIDO_SUFFIX, (_match, city: string | undefined) =>
    city ? '시' : '도',
  );
}

/**
 * 도로명 주소에서 시·도와 시·군·구까지만 남긴다.
 *
 * 도로명 주소는 `[시·도] [시·군·구] [도로명] [건물번호] (건물명)` 순서라
 * 앞의 두 조각만 쓰고, 건물명(괄호)과 나머지는 버린다.
 * 세종특별자치시처럼 시·군·구가 없는 곳은 시·도까지만 반환한다.
 *
 * @param {string | null | undefined} address - 도로명 주소 (예: '서울 강남구 테헤란로 152 (강남파이낸스센터)')
 * @returns {string} 화면용 지역 표기 (예: '서울시 강남구'). 주소가 비어 있으면 빈 문자열
 *
 * @example
 * formatRegion('서울 강남구 테헤란로 152 (강남파이낸스센터)'); // '서울시 강남구'
 * formatRegion('경기 성남시 분당구 판교역로 235');             // '경기도 성남시'
 * formatRegion('세종특별자치시 한누리대로 2130');              // '세종시'
 * formatRegion('서울특별시 중구 세종대로 110 3층');            // '서울시 중구'
 */
export default function formatRegion(
  address: string | null | undefined,
): string {
  if (!address) return '';

  // 건물명은 괄호로 붙어 오므로 첫 괄호 앞까지만 본다
  const [sido, sigungu] = address
    .replace(/\s*\(.*$/, '')
    .trim()
    .split(/\s+/);

  if (!sido) return '';

  const sidoLabel = toSidoLabel(sido);

  // 도로명이 '시/군/구'로 끝나는 경우는 없어서, 이 검사로 세종 같은 단층 시를 걸러낼 수 있다
  if (!sigungu || !/[시군구]$/.test(sigungu)) return sidoLabel;

  return `${sidoLabel} ${sigungu}`;
}
