'use client';

import type { EstimateStatus } from '@/types/estimate';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailQuery } from '@/hooks/queries/estimates/queries';
import { useMoverDetailQuery } from '@/hooks/queries/mover/queries';

import EstimateDetailContent from '@/components/common/Estimate/EstimateDetailContent';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** 받았던 견적 상세에서 유효한 상태
 * - 이미 결론이 난 견적(확정/미선택/만료)만 이 페이지 대상 */
const RECEIVED_ESTIMATE_STATUSES: EstimateStatus[] = [
  'ACCEPTED',
  'NOT_SELECTED',
  'EXPIRED',
];

export default function EstimateReceivedDetailPageContent({
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

  /** 받았던 견적이 아닐 때 */
  if (!RECEIVED_ESTIMATE_STATUSES.includes(estimate.status)) {
    return (
      <EmptyState
        message="받았던 견적이 아니에요."
        buttonLabel="받았던 견적 보기"
        href={ROUTES.customerEstimates}
      />
    );
  }

  /** 받았던 견적 상세 페이지 컨텐츠 */
  return (
    <EstimateDetailContent
      variant="customerReceived"
      estimate={estimate}
      mover={mover}
    />
  );
}
