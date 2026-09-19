import IcStarFill from '@/assets/icons/ic_star_fill.svg';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

interface MoverReviewItemProps {
  nickname: string;
  createdAt: string;
  rating: number;
  content: string;
  className?: string;
}

export default function MoverReviewItem({
  nickname,
  createdAt,
  rating,
  content,
  className,
}: MoverReviewItemProps) {
  return (
    <article
      className={cn(
        'flex flex-col gap-[16px] py-[20px]',
        'tablet:gap-[24px] tablet:py-[24px]',
        className,
      )}
    >
      <div className="flex flex-col gap-[8px]">
        <div
          className={cn('flex items-center gap-[12px]', 'tablet:gap-[14px]')}
        >
          <p
            className={cn(
              'text-md-regular text-black-400',
              'tablet:text-2lg-regular',
            )}
          >
            {nickname}
          </p>
          <span
            aria-hidden
            className={cn('h-[12px] w-px bg-line-200', 'tablet:h-[14px]')}
          />
          <time
            dateTime={createdAt}
            className={cn(
              'text-md-regular text-gray-300',
              'tablet:text-2lg-regular',
            )}
          >
            {formatDate(createdAt, 'review')}
          </time>
        </div>
        <div className="flex" aria-label={`${rating}점`}>
          {Array.from({ length: 5 }, (_, index) => (
            <IcStarFill
              key={index}
              aria-hidden
              className={cn(
                'h-[20px] w-[20px]',
                index >= rating && 'opacity-20',
              )}
            />
          ))}
        </div>
      </div>
      <p
        className={cn(
          'whitespace-pre-wrap text-md-regular text-black-500',
          'tablet:text-2lg-regular',
        )}
      >
        {content}
      </p>
    </article>
  );
}
