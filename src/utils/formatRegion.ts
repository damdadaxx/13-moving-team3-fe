/*
@ 주소 → 시·군·구 표기
- 서울특별시/부산광역시 → 서울시/부산시, 강원특별자치도 → 강원도
*/

const SIDO_ABBREVIATIONS: [RegExp, string][] = [
  [/특별자치시$/, '시'],
  [/특별시$/, '시'],
  [/광역시$/, '시'],
  [/특별자치도$/, '도'],
];

function abbreviateSido(sido: string): string {
  return SIDO_ABBREVIATIONS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    sido,
  );
}

export default function formatRegion(address: string): string {
  const parts = address.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';

  const sido = abbreviateSido(parts[0]);
  const sigungu = parts.find(
    (part, index) => index > 0 && /(?:시|군|구)$/.test(part),
  );

  return sigungu ? `${sido} ${sigungu}` : sido;
}
