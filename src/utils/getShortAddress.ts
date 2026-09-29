// 전체 주소를 "시/도 시/군/구" 형태로 축약한다 (예: "서울특별시 중구 세종대로 110" -> "서울시 중구")
const SIDO_SHORT_NAME_MAP: Record<string, string> = {
  서울특별시: '서울시',
  부산광역시: '부산시',
  대구광역시: '대구시',
  인천광역시: '인천시',
  광주광역시: '광주시',
  대전광역시: '대전시',
  울산광역시: '울산시',
  세종특별자치시: '세종시',
  경기도: '경기도',
  강원특별자치도: '강원도',
  충청북도: '충북',
  충청남도: '충남',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주도',
};

/** 매칭 실패 시(형식이 다르거나 토큰이 부족하면) 원본 주소를 그대로 돌려준다 */
export default function getShortAddress(address: string): string {
  const [sido, sigungu] = address.trim().split(/\s+/);
  if (!sido || !sigungu) return address;

  const shortSido = SIDO_SHORT_NAME_MAP[sido] ?? sido;
  return `${shortSido} ${sigungu}`;
}
