import {
  ESTIMATE_STATUS_COLOR,
  ESTIMATE_STATUS_TEXT,
  type EstimateStatus,
} from '@/types/estimate';

import IcCheckedEstimate from '@/assets/icons/ic_checked_estimate.svg';

import { cn } from '@/utils/cn';

/**
 * @ 견적 상태 배지 컴포넌트
 * - 견적대기/지정견적 등은 색상 텍스트로, 확정견적(ACCEPTED)은 체크 아이콘이 붙은 칩으로 표시
 */
export default function EstimateStatusBadge({
  status,
  className,
}: {
  status: EstimateStatus;
  className?: string;
}) {
  if (status === 'ACCEPTED') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-[4px] shrink-0 text-lg-bold text-orange-400',
          className,
        )}
      >
        <IcCheckedEstimate aria-hidden className="h-[20px] w-[20px]" />
        {ESTIMATE_STATUS_TEXT[status]}
      </span>
    );
  }

  return (
    <p
      className={cn(
        'inline-flex shrink-0 text-lg-semibold',
        ESTIMATE_STATUS_COLOR[status],
        className,
      )}
    >
      {ESTIMATE_STATUS_TEXT[status]}
    </p>
  );
}
