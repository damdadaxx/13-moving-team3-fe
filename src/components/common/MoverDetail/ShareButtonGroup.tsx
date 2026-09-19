// 기사님 찜하기 버튼 그룹 컴포넌트
'use client';

import { useState } from 'react';

import IcLikeBlack from '@/assets/icons/ic_like_black.svg';
import IcLikeEmpty from '@/assets/icons/ic_like_empty.svg';

import { cn } from '@/utils/cn';

interface ShareButtonGroupProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  likeCount: number;
}

export default function ShareButtonGroup({
  className,
  likeCount,
  ...props
}: ShareButtonGroupProps) {
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <button
      className={cn('flex items-center gap-[4px] cursor-pointer', className)}
      type="button"
      onClick={handleLikeClick}
      {...props}
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
