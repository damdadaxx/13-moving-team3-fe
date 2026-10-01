'use client';

import type { EstimateStatus } from '@/types/estimate';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailWithMover } from '@/hooks/features/estimate/queries/queries';

import EstimateDetailContent from '@/components/features/common/Estimate/EstimateDetailContent';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 대기중인 견적 상세에서 유효한 상태
 * - 확정/미선택/만료된 견적은 이 페이지 대상이 아님 */
const PENDING_ESTIMATE_STATUSES: EstimateStatus[] = ['PROPOSED', 'DESIGNATED'];

export default function EstimatePendingDetailPageContent({
  estimateId,
}: {
  estimateId: string;
}) {
  // 견적 상세 + 기사님 상세 조회
  const detail = useEstimateDetailWithMover(estimateId);

  // 견적 조회 대기
  if (detail.status === 'loading') {
    return <LoadingDisplay />;
  }

  // 견적 조회 실패
  if (detail.status === 'estimate-error') {
    return <EmptyState message="견적 정보를 찾을 수 없어요." />;
  }

  // 기사님 조회 실패
  if (detail.status === 'mover-error') {
    return <EmptyState message="기사님 정보를 찾을 수 없어요." />;
  }

  // 견적 상세 + 기사님 상세 조회 성공
  const { estimate, mover } = detail;

  /** 대기중인 견적이 아닐 때 */
  if (!PENDING_ESTIMATE_STATUSES.includes(estimate.status)) {
    return (
      <EmptyState
        message="대기중인 견적이 아니에요."
        buttonLabel="대기중인 견적 보기"
        href={ROUTES.customerEstimatesPending}
      />
    );
  }

  /** 대기중인 견적 상세 페이지 컨텐츠 */
  return (
    <EstimateDetailContent
      variant="customerPending"
      estimate={estimate}
      mover={mover}
    />
  );
}
