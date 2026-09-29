'use client';

import { useMoverLike } from '@/hooks/likes/useMoverLike';

import ButtonIcon from '@/components/ui/Button/ButtonIcon';

/*
@ 기사님 찜 아이콘 버튼
- 클릭 즉시 낙관적으로 활성 상태를 보여 주고, 서버 응답으로 확정한다
- isPending이면 중복 클릭만 막고, 스피너로 아이콘을 가리지 않는다
*/
export default function MoverLikeIconButton({
  moverId,
  likeCount,
}: {
  moverId: string;
  likeCount: number;
}) {
  const { isLiked, isPending, toggleLike } = useMoverLike(moverId, likeCount);

  return (
    <ButtonIcon
      variant="like"
      size="md"
      onClick={toggleLike}
      disabled={isPending}
      aria-pressed={isLiked}
      aria-label={isLiked ? '찜 취소하기' : '찜하기'}
    />
  );
}
