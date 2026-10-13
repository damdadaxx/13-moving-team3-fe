// [공용] 기사님 리뷰 목록 스켈레톤
import { cn } from '@/utils/cn';

import { Skeleton } from '@/components/ui/Skeleton';

const REVIEW_SKELETON_COUNT = 3;

/** @ 리뷰 평점 요약 자리표시 */
function ReviewSummarySkeleton() {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-[24px]',
        'tablet:flex-row tablet:items-start tablet:justify-between',
      )}
    >
      <div className="flex items-center gap-[18px]">
        <Skeleton width={64} height={40} />
        <div className="flex flex-col gap-[8px]">
          <Skeleton width={100} height={20} />
          <Skeleton width={72} height={16} />
        </div>
      </div>
      <div
        className={cn(
          'flex w-full flex-col gap-[10px]',
          'tablet:w-[264px] tablet:gap-[10px]',
        )}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-[16px]">
            <Skeleton width={36} height={16} />
            <div
              className={cn(
                'min-w-0 flex-1',
                'tablet:w-[180px] tablet:flex-none',
              )}
            >
              <Skeleton height={8} borderRadius={15} />
            </div>
            <Skeleton width={36} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** @ 리뷰 한 건 자리표시 */
function ReviewItemSkeleton({ hasDivider }: { hasDivider: boolean }) {
  return (
    <li className={cn(hasDivider && 'border-b border-line-100')}>
      <div
        className={cn(
          'flex flex-col gap-[16px] py-[20px]',
          'tablet:gap-[24px] tablet:py-[24px]',
        )}
      >
        <div className="flex flex-col gap-[8px]">
          <div
            className={cn('flex items-center gap-[12px]', 'tablet:gap-[14px]')}
          >
            <Skeleton width={56} height={16} className="tablet:h-[26px]!" />
            <Skeleton width={88} height={16} className="tablet:h-[26px]!" />
          </div>
          <Skeleton width={100} height={20} />
        </div>
        <Skeleton width="92%" height={20} className="tablet:h-[26px]!" />
      </div>
    </li>
  );
}

/** @ 기사님 리뷰 섹션 자리표시 */
export default function MoverReviewListSkeleton() {
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <Skeleton
        width={32}
        height={26}
        className="tablet:h-[32px]! tablet:w-[40px]!"
      />
      <ReviewSummarySkeleton />
      <ul>
        {Array.from({ length: REVIEW_SKELETON_COUNT }, (_, index) => (
          <ReviewItemSkeleton
            key={index}
            hasDivider={index < REVIEW_SKELETON_COUNT - 1}
          />
        ))}
      </ul>
    </div>
  );
}
