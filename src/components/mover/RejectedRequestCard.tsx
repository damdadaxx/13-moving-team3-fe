// [메뉴] 내 견적 관리 메뉴 > 반려 요청 탭메뉴
// Figma: Card-list/반려 요청, node 1:9536
//
// 목록(GET /estimates) 응답에는 고객 이름이 없어서, 상세(GET /estimates/{estimateId})를
// 카드마다 따로 조회해 customer.name만 꺼내 쓴다
'use client';

import type { EstimateGroup, EstimateSummary } from '@/types/estimate';

import { useEstimateDetailQuery } from '@/hooks/queries/estimate/queries';

import formatDate from '@/utils/formatDate';

import EstimateCard from '@/components/ui/EstimateCard';

import EstimateRequestSummary from './EstimateRequestSummary';

interface RejectedRequestCardProps {
  estimateRequest: EstimateGroup['estimateRequest'];
  estimate: EstimateSummary;
}

export default function RejectedRequestCard({
  estimateRequest,
  estimate,
}: RejectedRequestCardProps) {
  const { data: detail } = useEstimateDetailQuery(estimate.estimateId);

  const moveDateLabel = formatDate(estimateRequest.moveDate, 'korean');

  return (
    <EstimateCard className="relative overflow-hidden">
      <EstimateRequestSummary
        variant="card"
        serviceType={estimateRequest.serviceType}
        isDesignated={estimate.isDesignated}
        customerName={detail?.customer.name ?? ''}
        fromRegion={estimateRequest.departureAddress}
        toRegion={estimateRequest.arrivalAddress}
        moveDate={moveDateLabel}
      />

      <div className="absolute inset-0 flex items-center justify-center rounded-[20px] border border-gray-300 bg-black-500/64">
        <p className="text-2lg-semibold text-white">반려된 요청이에요</p>
      </div>
    </EstimateCard>
  );
}
