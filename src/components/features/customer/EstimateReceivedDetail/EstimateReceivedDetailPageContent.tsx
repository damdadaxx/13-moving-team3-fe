'use client';

import type { EstimateStatus } from '@/types/estimate';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailWithMover } from '@/hooks/features/estimate/queries/queries';

import EstimateDetailContent from '@/components/features/common/Estimate/EstimateDetailContent';
import EstimateDetailSkeleton from '@/components/features/common/Estimate/EstimateDetailSkeleton';
import EmptyState from '@/components/ui/EmptyState';

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
  const tEstimate = useTranslations('Estimate');
  const tMover = useTranslations('MoverDetail');
  const t = useTranslations('CustomerEstimates');
  // 견적 상세 + 기사님 상세 조회
  const detail = useEstimateDetailWithMover(estimateId);

  // 견적 조회 대기
  if (detail.status === 'loading') {
    return <EstimateDetailSkeleton variant="customerReceived" />;
  }

  // 견적 조회 실패
  if (detail.status === 'estimate-error') {
    return <EmptyState fit="titleAndTab" message={tEstimate('notFound')} />;
  }

  // 기사님 조회 실패
  if (detail.status === 'mover-error') {
    return <EmptyState fit="titleAndTab" message={tMover('notFound')} />;
  }

  // 견적 상세 + 기사님 상세 조회 성공
  const { estimate, mover } = detail;

  /** 받았던 견적이 아닐 때 */
  if (!RECEIVED_ESTIMATE_STATUSES.includes(estimate.status)) {
    return (
      <EmptyState
        fit="titleAndTab"
        message={t('notReceived')}
        buttonLabel={t('goReceived')}
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
