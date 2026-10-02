import type { EstimateStatus } from '@/types/estimate';

import { cn } from '@/utils/cn';

import EstimateStatusBadge from '@/components/features/common/Estimate/EstimateStatusBadge';

/**
 * @ 고객 소개(이름 + 상태뱃지)
 * - 기사님 확정견적 상세에서만 렌더한다
 */
export default function CustomerEstimateIntro({
  customerName,
  status,
}: {
  customerName: string;
  status: EstimateStatus;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pt-[8px] pb-[20px] border-b border-line-100',
        'tablet:pb-[30px]',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-[6px] text-2lg-semibold text-black-400',
          'tablet:text-2xl-semibold',
        )}
      >
        <span>{customerName}</span>
        <span>고객님</span>
      </p>
      <EstimateStatusBadge
        status={status}
        className={cn('hidden tablet:flex')}
      />
    </div>
  );
}
