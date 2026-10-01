import { cn } from '@/utils/cn';

import StarRating from '@/components/ui/StarRating';

interface RatingDistribution {
  score: number;
  count: number;
}

interface MoverReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
  distribution: readonly RatingDistribution[];
}

/**
 * @ 리뷰 평점 바 컴포넌트
 * - 리뷰 평점과 리뷰 개수를 표시
 */
function RatingBar({
  score,
  count,
  totalCount,
  isHighest,
}: RatingDistribution & { totalCount: number; isHighest: boolean }) {
  const percent = totalCount === 0 ? 0 : (count / totalCount) * 100;

  return (
    <div className="flex w-full items-center gap-[16px]">
      <p
        className={cn(
          'w-[36px] text-black-300',
          isHighest ? 'text-md-bold' : 'text-md-medium',
        )}
      >
        {score}점
      </p>
      <div
        className={cn(
          'relative h-[8px] min-w-0 flex-1 overflow-hidden rounded-[15px] bg-background-300',
          'tablet:w-[180px] tablet:flex-none',
        )}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-[15px] bg-yellow-100"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p
        className={cn(
          'w-[36px] text-gray-300',
          isHighest ? 'text-md-bold' : 'text-md-medium',
        )}
      >
        {count}
      </p>
    </div>
  );
}

/**
 * @ 기사님 리뷰 요약 컴포넌트
 * - 기사님 평점과 리뷰 개수를 표시
 */
export default function MoverReviewSummary({
  averageRating,
  reviewCount,
  distribution,
}: MoverReviewSummaryProps) {
  const highestCount = Math.max(...distribution.map((item) => item.count));

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-[24px]',
        'tablet:flex-row tablet:items-start tablet:justify-between',
      )}
    >
      <div className="flex items-center gap-[18px]">
        <p className="text-[40px] leading-none font-medium text-black-400">
          {averageRating.toFixed(1)}
        </p>
        <div className="flex flex-col">
          <StarRating value={averageRating} readOnly />
          <p
            className={cn(
              'text-lg-regular text-gray-500',
              'tablet:text-md-regular',
            )}
          >
            {reviewCount}개의 리뷰
          </p>
        </div>
      </div>
      <div className={cn('flex w-full flex-col gap-[4px]', 'tablet:w-auto')}>
        {distribution.map((item) => (
          <RatingBar
            key={item.score}
            {...item}
            totalCount={reviewCount}
            isHighest={item.count === highestCount && item.count > 0}
          />
        ))}
      </div>
    </div>
  );
}
