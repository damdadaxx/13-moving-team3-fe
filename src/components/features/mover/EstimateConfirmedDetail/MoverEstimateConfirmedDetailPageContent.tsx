'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import { useEstimateDetailWithMover } from '@/hooks/features/estimate/queries/queries';

import EstimateDetailContent from '@/components/features/common/Estimate/EstimateDetailContent';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function MoverEstimateConfirmedDetailPageContent({
  estimateId,
}: {
  estimateId: string;
}) {
  const tEstimate = useTranslations('Estimate');
  const tMover = useTranslations('MoverDetail');
  const t = useTranslations('MoverEstimates');
  // 견적 상세 + 기사님 상세 조회
  const detail = useEstimateDetailWithMover(estimateId);

  // 견적 조회 대기
  if (detail.status === 'loading') {
    return <LoadingDisplay />;
  }

  // 견적 조회 실패
  if (detail.status === 'estimate-error') {
    return <EmptyState message={tEstimate('notFound')} />;
  }

  // 기사님 조회 실패
  if (detail.status === 'mover-error') {
    return <EmptyState message={tMover('notFound')} />;
  }

  // 견적 상세 + 기사님 상세 조회 성공
  const { estimate, mover } = detail;

  /** 확정된 견적이 아닐 때 */
  if (estimate.status !== 'ACCEPTED') {
    return (
      <EmptyState
        message={t('notConfirmed')}
        buttonLabel={t('goSent')}
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
