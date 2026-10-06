// 기사님 카드에 들어가는 수치(평점) 표기 유틸
//
// 백엔드는 평점을 평균값(averageRating)으로 내려준다.
// 경력 표기는 언어별 단위가 필요해 useFormatCareer(hooks/common)와 messages > Common 이 맡는다.

/**
 * 평균 평점을 '5.0' 형태로 바꾼다.
 *
 * 백엔드는 리뷰가 없으면 averageRating을 null로 내려준다.
 * 이때는 '0.0'을 돌려주므로, 별점 자체를 감추고 싶으면 호출하는 쪽에서
 * 리뷰 수(reviewCount)가 0인지 함께 확인한다.
 *
 * @param {number | null | undefined} averageRating - 평균 평점 (리뷰가 없으면 null)
 * @returns {string} 소수점 첫째 자리까지의 평점 (예: '5.0')
 *
 * @example
 * formatRating(4.75); // '4.8'
 * formatRating(null); // '0.0'
 */
export function formatRating(averageRating: number | null | undefined): string {
  if (averageRating == null || !Number.isFinite(averageRating)) return '0.0';

  return averageRating.toFixed(1);
}
