import type { RatingDistributionItem } from '@/types/review';

const RATING_SCORES = [5, 4, 3, 2, 1] as const;

/*
@ 리뷰 작성자 표시
- API에 이름이 있으면 앞글자만 남기고 마스킹한다
- 없으면 fallback (기본 '고객****', 화면에서는 현재 언어 문구를 넘긴다)
*/
export function formatMaskedReviewerName(
  name?: string | null,
  fallback = '고객****',
): string {
  const trimmed = name?.trim();
  if (!trimmed) return fallback;

  const isAscii = /^[\x00-\x7F]+$/.test(trimmed);
  const visibleLength = isAscii ? Math.min(3, trimmed.length) : 1;
  return `${trimmed.slice(0, visibleLength)}****`;
}

export function toRatingDistribution(items: RatingDistributionItem[]) {
  return RATING_SCORES.map((score) => ({
    score,
    count: items.find((item) => item.rating === score)?.count ?? 0,
  }));
}
