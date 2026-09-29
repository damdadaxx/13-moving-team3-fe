'use client';

import { Rating } from 'next-flex-rating';

import IcStarFill from '@/assets/icons/ic_star_fill.svg';

import { cn } from '@/utils/cn';

const STAR_COLOR = '#FFC149';
const STAR_EMPTY_COLOR = 'rgba(255, 193, 73, 0.2)';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  className?: string;
}

/**
 * @ 별점 평가 컴포넌트
 * - 별점을 표시하고 수정 가능
 */
export default function StarRating({
  value,
  onChange,
  readOnly,
  size = 20,
  className,
}: StarRatingProps) {
  const isReadOnly = readOnly ?? !onChange;
  const starIcon = <IcStarFill aria-hidden className="size-full" />;

  return (
    <div
      className={cn('inline-flex', className)}
      aria-label={isReadOnly ? `${value}점` : undefined}
    >
      <Rating
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        size={size}
        spacing={0}
        color={STAR_COLOR}
        emptyColor={STAR_EMPTY_COLOR}
        icon={starIcon}
        emptyIcon={starIcon}
      />
    </div>
  );
}
