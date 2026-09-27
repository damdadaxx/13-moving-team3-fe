'use client';

import type { EstimateStatus } from '@/types/estimate';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailQuery } from '@/hooks/queries/estimates/queries';
import { useMoverDetailQuery } from '@/hooks/queries/mover/queries';

import EstimateDetailContent from '@/components/common/Estimate/EstimateDetailContent';
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
  const {
    data: estimate,
    isPending: isEstimatePending,
    isError: isEstimateError,
  } = useEstimateDetailQuery(estimateId);

  const moverId = estimate?.mover.moverId ?? '';
  const {
    data: mover,
    isPending: isMoverPending,
    isError: isMoverError,
  } = useMoverDetailQuery(moverId);

  /** 로딩 중일 때 */
  if (isEstimatePending || isMoverPending) {
    return <LoadingDisplay />;
  }

  /** 에러 또는 데이터 없을 때 */
  if (isEstimateError || isMoverError || !estimate || !mover) {
    return <EmptyState message="견적 정보를 찾을 수 없어요." />;
  }

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
