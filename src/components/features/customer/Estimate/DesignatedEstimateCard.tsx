// [메뉴] 내 견적 관리 메뉴 > 대기 중인 견적
// 고객이 지정 견적을 요청했지만 기사님이 아직 금액을 보내지 않은 카드 (확정 버튼 없음)
'use client';

import type { Estimate } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import EstimateCard from '@/components/ui/EstimateCard';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

import MoverSummary from './MoverSummary';

interface DesignatedEstimateCardProps {
  estimate: Estimate;
  /** 이사 유형은 견적이 아니라 견적 요청에 달려 있어 따로 받는다 */
  serviceType: ServiceType;
}

export default function DesignatedEstimateCard({
  estimate,
  serviceType,
}: DesignatedEstimateCardProps) {
  const t = useTranslations('CustomerEstimates');
  const tStatus = useTranslations('EstimateStatus');
  const tagSize = useBreakpointValue(
    'sm' as const,
    'md' as const,
    'md' as const,
  );
  const { mover } = estimate;

  return (
    <EstimateCard className="gap-[16px] desktop:gap-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <ServiceTypeTag
            variant="service"
            serviceType={serviceType}
            size={tagSize}
          />
          <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
        </div>
        <span className="text-lg-semibold px-[8px] text-orange-400">
          {tStatus('DESIGNATED')}
        </span>
      </div>

      <MoverSummary
        name={mover.nickname}
        imgUrl={mover.imgUrl}
        likeCount={mover.likeCount}
        averageRating={mover.averageRating}
        reviewCount={mover.reviewCount}
        careerMonths={mover.careerMonths}
        confirmedCount={mover.confirmedEstimateCount}
      />

      <p className="text-md-regular text-gray-400 tablet:text-lg-regular">
        {t('designatedWaiting')}
      </p>
    </EstimateCard>
  );
}
