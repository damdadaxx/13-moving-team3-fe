'use client';

import IcLikeBlack from '@/assets/icons/ic_like_black.svg';
import IcLikeEmpty from '@/assets/icons/ic_like_empty.svg';

import { useMoverLike } from '@/hooks/likes/useMoverLike';

import { cn } from '@/utils/cn';

interface ShareButtonGroupProps {
  className?: string;
  moverId: string;
  likeCount: number;
}

/**
 * @ 기사님 찜하기 버튼 그룹 컴포넌트
 * - 기사님 찜하기 버튼과 찜 개수를 표시
 */
export default function ShareButtonGroup({
  className,
  moverId,
  likeCount: initialLikeCount,
}: ShareButtonGroupProps) {
  const { isLiked, likeCount, isPending, toggleLike } = useMoverLike(
    moverId,
    initialLikeCount,
  );

  return (
    <button
      className={cn('flex items-center gap-[4px] cursor-pointer', className)}
      type="button"
      onClick={toggleLike}
      disabled={isPending}
      aria-pressed={isLiked}
      aria-label={isLiked ? '찜 취소하기' : '찜하기'}
    >
      <p
        className={cn('text-md-medium text-gray-500', 'tablet:text-2lg-medium')}
      >
        {likeCount}
      </p>
      {isLiked ? (
        <IcLikeBlack className="h-[24px] w-[24px]" />
      ) : (
        <IcLikeEmpty className="h-[24px] w-[24px]" />
      )}
    </button>
  );
}
