import { cn } from '@/utils/cn';

import DesignatedEstimateRequestButton from '@/components/features/common/Estimate/DesignatedEstimateRequestButton';
import LikeButton from '@/components/features/common/MoverDetail/LikeButton';

/**
 * @ 기사님 찜하기 + 액션 버튼 하단 고정 바
 * - 데스크탑에서는 숨기고(desktop:hidden), 모바일/태블릿에서 화면 하단에 고정한다
 * - action을 안 넘기면 기본값(지정 견적 요청하기)을 쓴다.
 * - 견적 상세처럼 다른 CTA가 필요한 화면은 action에 원하는 버튼(예: EstimateConfirmButton)을 넘긴다
 */
export default function MoverStickyActionBar({
  moverId,
  likeCount,
  action,
  className,
}: {
  moverId: string;
  likeCount: number;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'fixed bottom-0 left-0 right-0 px-[20px] py-[28px] bg-gray-50 border-t border-line-200',
        'tablet:px-[72px]',
        'desktop:hidden',
        className,
      )}
    >
      <div className={cn('flex items-center gap-[8px] max-w-[1200px] mx-auto')}>
        <LikeButton variant="icon" moverId={moverId} likeCount={likeCount} />
        {action ?? (
          /** 지정 견적 요청하기 버튼 */
          <DesignatedEstimateRequestButton
            moverId={moverId}
            size="sm"
            className="flex-1"
          />
        )}
      </div>
    </section>
  );
}
