'use client';

import { useEffect, useRef } from 'react';

import { Rating } from 'next-flex-rating';
import { useTranslations } from 'next-intl';

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
 * - Rating 컴포넌트에 aria-label prop이 없어, ref로 직접 DOM에 aria-label을 설정해 접근성 이름을 제공한다
 */
export default function StarRating({
  value,
  onChange,
  readOnly,
  size = 20,
  className,
}: StarRatingProps) {
  const t = useTranslations('Review');
  const isReadOnly = readOnly ?? !onChange;
  const starIcon = <IcStarFill aria-hidden className="size-full" />;
  const sliderRef = useRef<HTMLDivElement>(null);
  const ariaLabel = t('ratingAria', { value });

  useEffect(() => {
    sliderRef.current?.setAttribute('aria-label', ariaLabel);
  }, [ariaLabel]);

  return (
    <div className={cn('inline-flex h-[20px]', className)}>
      <Rating
        ref={sliderRef}
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
