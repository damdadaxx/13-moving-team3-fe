import type { EstimateStatus } from '@/types/estimate';

import { cn } from '@/utils/cn';

import EstimateStatusBadge from '@/components/common/Estimate/EstimateStatusBadge';

/**
 * @ 기사님 소개(제목 + 상태뱃지)
 */
export default function MoverEstimateIntro({
  shortIntro,
  status,
}: {
  shortIntro: string;
  status: EstimateStatus;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between mb-[16px] pb-[12px] border-b border-line-100',
        'tablet:mb-[20px] tablet:pb-[20px]',
      )}
    >
      <h1
        className={cn(
          'text-2lg-semibold text-black-300',
          'tablet:text-2xl-semibold',
        )}
      >
        {shortIntro}
      </h1>
      <EstimateStatusBadge
        status={status}
        className={cn('hidden', 'tablet:inline-flex')}
      />
    </div>
  );
}
