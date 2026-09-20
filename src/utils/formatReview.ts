import type { RatingDistributionItem } from '@/types/review';

const RATING_SCORES = [5, 4, 3, 2, 1] as const;

/*
@ 리뷰 작성자 표시
- API에 이름이 있으면 앞글자만 남기고 마스킹한다
- 없으면 고객****
*/
export function formatMaskedReviewerName(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return '고객****';

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
