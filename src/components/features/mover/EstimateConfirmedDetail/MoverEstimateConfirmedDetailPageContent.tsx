'use client';

import { useTranslations } from 'next-intl';

import { useEstimateDetailWithMover } from '@/hooks/features/estimate/queries/queries';

import EstimateDetailContent from '@/components/features/common/Estimate/EstimateDetailContent';
import EstimateDetailSkeleton from '@/components/features/common/Estimate/EstimateDetailSkeleton';
import EmptyState from '@/components/ui/EmptyState';

export default function MoverEstimateConfirmedDetailPageContent({
  estimateId,
}: {
  estimateId: string;
}) {
  const tEstimate = useTranslations('Estimate');
  const tMover = useTranslations('MoverDetail');
  // 견적 상세 + 기사님 상세 조회
  const detail = useEstimateDetailWithMover(estimateId);

  // 견적 조회 대기
  if (detail.status === 'loading') {
    return <EstimateDetailSkeleton variant="moverConfirmed" />;
  }

  // 견적 조회 실패
  if (detail.status === 'estimate-error') {
    return <EmptyState fit="title" message={tEstimate('notFound')} />;
  }

  // 기사님 조회 실패
  if (detail.status === 'mover-error') {
    return <EmptyState fit="title" message={tMover('notFound')} />;
  }

  // 견적 상세 + 기사님 상세 조회 성공
  const { estimate, mover } = detail;

  /** 보낸 견적 상세 페이지 컨텐츠 (확정 여부는 상태 뱃지로 표시) */
  return (
    <EstimateDetailContent
      variant="moverConfirmed"
      estimate={estimate}
      mover={mover}
    />
  );
}
