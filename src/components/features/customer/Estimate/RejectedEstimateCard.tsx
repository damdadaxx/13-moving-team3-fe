// [메뉴] 내 견적 관리 메뉴 > 반려된 요청
// 기사님이 반려한 지정 견적 카드 (기사님 · 반려 사유)
'use client';

import type { Estimate } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import EstimateCard from '@/components/ui/EstimateCard';
import ExpandableText from '@/components/ui/ExpandableText';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface RejectedEstimateCardProps {
  estimate: Estimate;
  /** 이사 유형은 견적이 아니라 견적 요청에 달려 있어 따로 받는다 */
  serviceType: ServiceType;
}

export default function RejectedEstimateCard({
  estimate,
  serviceType,
}: RejectedEstimateCardProps) {
  const t = useTranslations('CustomerEstimates');
  const tMover = useTranslations('MoverCard');
  const tagSize = useBreakpointValue(
    'sm' as const,
    'md' as const,
    'md' as const,
  );

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
        <span className="text-lg-semibold px-[8px] text-gray-300">
          {t('rejectedBadge')}
        </span>
      </div>

      <p className="text-lg-semibold text-black-300 tablet:text-2lg-semibold">
        {tMover('nickname', { nickname: estimate.mover.nickname })}
      </p>

      <div className="flex flex-col gap-[4px] border-t border-line-200 pt-[16px]">
        <span className="text-md-medium text-gray-300">
          {t('rejectReason')}
        </span>
        <ExpandableText className="text-md-regular text-black-300 tablet:text-lg-regular">
          {estimate.rejectReason || t('noRejectReason')}
        </ExpandableText>
      </div>
    </EstimateCard>
  );
}
