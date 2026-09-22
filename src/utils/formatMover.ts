/*
@ 기사님 경력 표시
- API는 개월 수(careerMonths)로 내려준다
- 12개월 미만은 N개월, 이상은 N년
*/
export function formatCareerLabel(careerMonths: number): string {
  const years = Math.floor(careerMonths / 12);
  if (years < 1) return `${careerMonths}개월`;
  return `${years}년`;
}

export function formatRating(averageRating: number): string {
  return averageRating.toFixed(1);
}
