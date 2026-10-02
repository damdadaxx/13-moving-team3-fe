// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 탭메뉴
// Figma: Card-list/고객 견적(1:9293), Card-list/이사완료(1:9303)
//
// 목록(GET /estimates) 응답에는 고객 이름이 없어서, RejectedRequestCard처럼
// 상세(GET /estimates/{estimateId})를 카드마다 따로 조회해 customer.name만 꺼내 쓴다
'use client';

import type { EstimateGroup, MyEstimateSummary } from '@/types/estimate';
import { useTranslations } from 'next-intl';

import IcBadgeCheck from '@/assets/icons/ic_badge_check.svg';

import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useEstimateDetailQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import EstimateCard from '@/components/ui/EstimateCard';

import EstimateRequestSummary from './EstimateRequestSummary';

interface SentEstimateCardProps {
  estimateRequest: EstimateGroup['estimateRequest'];
  estimate: MyEstimateSummary;
}

export default function SentEstimateCard({
  estimateRequest,
  estimate,
}: SentEstimateCardProps) {
  const t = useTranslations('Estimate');
  const tStatus = useTranslations('EstimateStatus');
  const tMover = useTranslations('MoverEstimates');
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const { data: detail } = useEstimateDetailQuery(estimate.estimateId);

  const isConfirmed = estimate.status === 'ACCEPTED';
  // 이사일이 지나면 백엔드가 요청 상태를 COMPLETED로 바꾼다
  const isCompleted = estimateRequest.status === 'COMPLETED';

  return (
    <EstimateCard className="relative tablet:gap-[32px]">
      <EstimateRequestSummary
        variant="card"
        className="tablet:gap-[24px]"
        serviceType={estimateRequest.serviceType}
        isDesignated={estimate.isDesignated}
        customerName={detail?.customer.name ?? ''}
        fromRegion={estimateRequest.departureAddress}
        toRegion={estimateRequest.arrivalAddress}
        moveDate={formatDate(estimateRequest.moveDate, 'korean')}
        topRightSlot={
          isConfirmed && (
            <span className="flex items-center gap-[4px] text-lg-bold text-orange-400">
              <IcBadgeCheck aria-hidden className="size-[20px]" />
              {tStatus('ACCEPTED')}
            </span>
          )
        }
      />

      <div
        className={cn(
          'flex h-[47px] items-end border-t border-line-200',
          'tablet:h-[52px]',
        )}
      >
        <div className="flex w-full items-center justify-between tablet:items-end">
          <span
            className={cn(
              'text-md-medium text-gray-300',
              'tablet:text-lg-medium tablet:text-black-400',
            )}
          >
            {t('priceAmount')}
          </span>
          <span
            className={cn(
              'text-2lg-bold text-black-400',
              'tablet:text-2xl-bold',
            )}
          >
            {estimate.price != null ? formatPrice(estimate.price) : '-'}
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[20px] border border-gray-300 bg-black-500/64">
          <div className="flex w-[200px] flex-col items-center gap-[20px]">
            <p className="text-2lg-semibold text-gray-50">
              {tMover('completedOverlay')}
            </p>
            <Button
              variant="outlined"
              className="bg-orange-100"
              href={`/mover/estimates/sent/${estimate.estimateId}`}
            >
              {t('viewEstimateDetail')}
            </Button>
          </div>
        </div>
      )}
    </EstimateCard>
  );
}
