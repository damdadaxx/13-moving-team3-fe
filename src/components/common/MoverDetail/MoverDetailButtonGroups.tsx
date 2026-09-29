import { cn } from '@/utils/cn';

import ButtonLikeMover from '@/components/common/MoverDetail/ButtonLikeMover';
import DesignatedEstimateRequestButton from '@/components/common/MoverDetail/DesignatedEstimateRequestButton';

interface MoverActionButtonGroupProps {
  className?: string;
  moverId: string;
  nickname: string;
  likeCount: number;
}

/**
 * @ 기사님 상세 버튼 그룹 컴포넌트
 * - 지정 견적 요청 버튼과 좋아요 버튼
 */
export default function MoverActionButtonGroup({
  className,
  moverId,
  nickname,
  likeCount,
}: MoverActionButtonGroupProps) {
  return (
    <div className={cn('w-full', className)}>
      <p className="mb-[16px] text-2lg-semibold text-black-400">
        {nickname} 기사님에게
        <br />
        지정 견적을 요청해보세요!
      </p>
      <div className="flex w-full flex-col gap-[16px]">
        <DesignatedEstimateRequestButton moverId={moverId} size="lg" />
        <ButtonLikeMover moverId={moverId} likeCount={likeCount} />
      </div>
    </div>
  );
}
