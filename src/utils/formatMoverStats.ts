// 기사님 카드에 들어가는 수치(경력·평점) 표기 유틸
//
// 백엔드는 경력을 개월(careerMonths), 평점을 평균값(averageRating)으로 내려준다.
// 둘 다 화면 문구와 단위가 달라 카드마다 변환하지 않도록 여기서 한 번에 처리한다.

/**
 * 경력 개월 수를 '7년' 형태로 바꾼다.
 *
 * 1년이 안 되면 '0년' 대신 '1년 미만'으로 보여준다.
 *
 * @param {number | null | undefined} careerMonths - 경력 개월 수 (MoverProfile.careerMonths)
 * @returns {string} 화면용 경력 (예: '7년'). 값이 없으면 빈 문자열
 *
 * @example
 * formatCareer(88); // '7년'
 * formatCareer(6);  // '1년 미만'
 */
export function formatCareer(careerMonths: number | null | undefined): string {
  if (careerMonths == null || !Number.isFinite(careerMonths)) return '';
  if (careerMonths < 0) return '';

  const years = Math.floor(careerMonths / 12);

  return years > 0 ? `${years}년` : '1년 미만';
}

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
