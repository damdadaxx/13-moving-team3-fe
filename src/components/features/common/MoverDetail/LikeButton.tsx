'use client';

import IcLikeBlack from '@/assets/icons/ic_like_black.svg';
import IcLikeEmpty from '@/assets/icons/ic_like_empty.svg';

import { useMoverLike } from '@/hooks/features/like/useMoverLike';

import { cn } from '@/utils/cn';

import ButtonElement from '@/components/ui/Button/ButtonElement';
import ButtonIcon from '@/components/ui/Button/ButtonIcon';

interface LikeButtonProps {
  className?: string;
  moverId: string;
  likeCount: number;
  /**
   * icon: 아이콘만 있는 토글 버튼 (하단 고정 바)
   * text: 테두리 + "기사님 찜하기" 텍스트가 있는 토글 버튼 (데스크탑 버튼 그룹)
   * count: 찜 개수 + 아이콘 (기사님 정보 상단)
   */
  variant: 'icon' | 'text' | 'count';
  iconFirst?: boolean; /** count 전용. true: 하트 아이콘 → 개수 / false: 개수 → 하트 아이콘 */
  readOnly?: boolean; /** count 전용. true면 클릭해도 찜 토글이 안 되고, 하트도 항상 채워진 상태 노출 (예: 기사님 자기 마이페이지) */
}

/**
 * @ 기사님 찜하기 버튼
 * - readOnly는 useMoverLike를 아예 호출하지 않는 정적 표시로 분기
 *   (본인 마이페이지에서 자기 자신을 찜 조회할 필요가 없어서 API 호출을 없앤다)
 */
export default function LikeButton({
  className,
  moverId,
  likeCount,
  variant,
  iconFirst = false,
  readOnly = false,
}: LikeButtonProps) {
  if (variant === 'count' && readOnly) {
    return (
      <CountBadge
        className={className}
        likeCount={likeCount}
        iconFirst={iconFirst}
      />
    );
  }

  return (
    <LikeToggle
      className={className}
      moverId={moverId}
      likeCount={likeCount}
      variant={variant}
      iconFirst={iconFirst}
    />
  );
}

/** @ 찜 개수 표시 뱃지 */
function CountBadge({
  className,
  likeCount,
  iconFirst,
}: {
  className?: string;
  likeCount: number;
  iconFirst: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-[4px]',
        iconFirst && 'flex-row-reverse justify-end',
        className,
      )}
      aria-label={`찜 ${likeCount}개`}
    >
      <p
        className={cn('text-md-medium text-gray-500', 'tablet:text-2lg-medium')}
      >
        {likeCount}
      </p>
      <IcLikeBlack className="h-[24px] w-[24px]" />
    </div>
  );
}

/** @ 찜 토글 버튼 */
function LikeToggle({
  className,
  moverId,
  likeCount: initialLikeCount,
  variant,
  iconFirst,
}: {
  className?: string;
  moverId: string;
  likeCount: number;
  variant: 'icon' | 'text' | 'count';
  iconFirst: boolean;
}) {
  const { isLiked, likeCount, isPending, toggleLike } = useMoverLike(
    moverId,
    initialLikeCount,
  );

  if (variant === 'icon') {
    return (
      <ButtonIcon
        variant="like"
        size="md"
        onClick={toggleLike}
        disabled={isPending}
        aria-pressed={isLiked}
        aria-label={isLiked ? '찜 취소하기' : '찜하기'}
        className={className}
      />
    );
  }

  if (variant === 'text') {
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

  return (
    <button
      className={cn(
        'flex items-center gap-[4px] cursor-pointer',
        iconFirst && 'flex-row-reverse justify-end',
        className,
      )}
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
