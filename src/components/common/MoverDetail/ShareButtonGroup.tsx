'use client';

import IcLikeBlack from '@/assets/icons/ic_like_black.svg';
import IcLikeEmpty from '@/assets/icons/ic_like_empty.svg';

import { useMoverLike } from '@/hooks/likes/useMoverLike';

import { cn } from '@/utils/cn';

interface ShareButtonGroupProps {
  className?: string;
  moverId: string;
  likeCount: number;
  iconFirst?: boolean; /** true: 하트 아이콘 → 개수 / false: 개수 → 하트 아이콘 */
  readOnly?: boolean; /** true면 클릭해도 찜 토글이 안 되고, 하트도 항상 채워진 상태 노출 (예: 기사님 자기 마이페이지) */
}

/**
 * @ 기사님 찜하기 버튼 그룹 컴포넌트
 * - 기사님 찜하기 버튼과 찜 개수를 표시
 * - readOnly는 useMoverLike를 아예 호출하지 않는 정적 표시로 분기
 *   (본인 마이페이지에서 자기 자신을 찜 조회할 필요가 없어서 API 호출을 없앤다)
 */
export default function ShareButtonGroup({
  className,
  moverId,
  likeCount,
  iconFirst = false,
  readOnly = false,
}: ShareButtonGroupProps) {
  if (readOnly) {
    return (
      <LikeCountBadge
        className={className}
        likeCount={likeCount}
        iconFirst={iconFirst}
      />
    );
  }

  return (
    <LikeToggleButton
      className={className}
      moverId={moverId}
      likeCount={likeCount}
      iconFirst={iconFirst}
    />
  );
}

/**
 * @ 기사님 찜 개수 뱃지 컴포넌트
 * - 찜 개수를 표시 (클릭 액션 없음)
 * - 하트 아이콘 노출 여부에 따라 좌우 방향 조정
 */
function LikeCountBadge({
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

/**
 * @ 기사님 찜하기 버튼 그룹 컴포넌트
 * - 찜 토글 버튼과 찜 개수를 표시 (클릭 액션 있음)
 */
function LikeToggleButton({
  className,
  moverId,
  likeCount: initialLikeCount,
  iconFirst,
}: {
  className?: string;
  moverId: string;
  likeCount: number;
  iconFirst: boolean;
}) {
  const { isLiked, likeCount, isPending, toggleLike } = useMoverLike(
    moverId,
    initialLikeCount,
  );

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
