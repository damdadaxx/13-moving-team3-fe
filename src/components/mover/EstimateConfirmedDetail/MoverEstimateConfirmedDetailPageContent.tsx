'use client';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailQuery } from '@/hooks/queries/estimates/queries';
import { useMoverDetailQuery } from '@/hooks/queries/mover/queries';

import EstimateDetailContent from '@/components/common/Estimate/EstimateDetailContent';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function MoverEstimateConfirmedDetailPageContent({
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

  /** 확정된 견적이 아닐 때 */
  if (estimate.status !== 'ACCEPTED') {
    return (
      <EmptyState
        message="확정된 견적이 아니에요."
        buttonLabel="보낸 견적 보기"
        href={ROUTES.moverEstimates}
      />
    );
  }

  /** 확정된 견적 상세 페이지 컨텐츠 */
  return (
    <EstimateDetailContent
      variant="moverConfirmed"
      estimate={estimate}
      mover={mover}
    />
  );
}
