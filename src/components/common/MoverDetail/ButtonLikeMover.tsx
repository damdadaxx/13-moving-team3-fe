'use client';

import IcLikeBlack from '@/assets/icons/ic_like_black.svg';
import IcLikeEmpty from '@/assets/icons/ic_like_empty.svg';

import { useMoverLike } from '@/hooks/likes/useMoverLike';

import { cn } from '@/utils/cn';

import ButtonElement from '@/components/ui/Button/ButtonElement';

export default function ButtonLikeMover({
  className,
  moverId,
  likeCount,
}: {
  className?: string;
  moverId: string;
  likeCount: number;
}) {
  const { isLiked, isPending, toggleLike } = useMoverLike(moverId, likeCount);

  return (
    <ButtonElement
      type="button"
      disabled={isPending}
      onClick={toggleLike}
      aria-pressed={isLiked}
      aria-label={isLiked ? '찜 취소하기' : '기사님 찜하기'}
      className={cn(
        'h-[54px] gap-[10px] rounded-[16px] border border-line-200 bg-gray-50 p-[10px] hover:bg-background-100',
        className,
      )}
    >
      {isLiked ? (
        <IcLikeBlack aria-hidden className="h-[24px] w-[24px]" />
      ) : (
        <IcLikeEmpty aria-hidden className="h-[24px] w-[24px]" />
      )}
      <span className="text-2lg-semibold text-black-400">기사님 찜하기</span>
    </ButtonElement>
  );
}
