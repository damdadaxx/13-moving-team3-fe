import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import DesignatedEstimateRequestButton from '@/components/features/common/Estimate/DesignatedEstimateRequestButton';
import LikeButton from '@/components/features/common/MoverDetail/LikeButton';

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
  const t = useTranslations('MoverDetail');

  return (
    <div className={cn('w-full', className)}>
      <p className="mb-[16px] text-2lg-semibold text-black-400">
        {t('requestLine1', { nickname })}
        <br />
        {t('requestLine2')}
      </p>
      <div className="flex w-full flex-col gap-[16px]">
        <DesignatedEstimateRequestButton moverId={moverId} size="lg" />
        <LikeButton variant="text" moverId={moverId} likeCount={likeCount} />
      </div>
    </div>
  );
}
