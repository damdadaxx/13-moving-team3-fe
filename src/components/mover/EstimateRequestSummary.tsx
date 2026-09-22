// 견적 요청 정보 요약 (칩 + 이름 + 구분선 + 출발지/도착지/이사일)
// SendEstimateModal / RejectRequestModal / ReceivedRequestCard에서 공유한다
'use client';

import type { ServiceType } from '@/types/serviceType';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import getShortAddress from '@/utils/getShortAddress';

import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

interface EstimateRequestSummaryProps {
  serviceType: ServiceType;
  isDesignated: boolean;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  /*
  @ variant
  - modal: SendEstimateModal/RejectRequestModal. 칩 옆 보조 요소 없음,
    값 텍스트는 얇고 반응형(md→lg), 구분선은 출발지/도착지/이사일 아래.
  - card: ReceivedRequestCard 등 목록 카드. 칩 옆에 topRightSlot(상대 시간 등),
    값 텍스트는 굵고 고정 크기, 구분선은 이름 바로 아래.
  */
  variant?: 'modal' | 'card';
  /** variant="card"일 때 칩 줄 오른쪽에 보여줄 보조 요소 (예: 상대 시간) */
  topRightSlot?: React.ReactNode;
}

export default function EstimateRequestSummary({
  serviceType,
  isDesignated,
  customerName,
  fromRegion,
  toRegion,
  moveDate,
  variant = 'modal',
  topRightSlot,
}: EstimateRequestSummaryProps) {
  const tagSize = useBreakpointValue({
    mobile: 'sm' as const,
    tablet: 'md' as const,
    desktop: 'md' as const,
  });
  const isCard = variant === 'card';
  const divider = <div className="h-px w-full bg-line-100" />;

  const chips = (
    <div className="flex items-center gap-[8px]">
      <ServiceTypeTag
        variant="service"
        serviceType={serviceType}
        size={tagSize}
      />
      {isDesignated && (
        <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
      )}
    </div>
  );

  const name = (
    <p className="text-xl-semibold text-black-300">{customerName} 고객님</p>
  );

  const detailValueClassName = isCard
    ? 'text-lg-semibold text-black-500'
    : 'text-md-medium text-black-500 desktop:text-lg-medium';

  const displayFromRegion = getShortAddress(fromRegion);
  const displayToRegion = getShortAddress(toRegion);

  return (
    <div className="flex flex-col gap-[16px] desktop:gap-[24px]">
      {isCard ? (
        <div className="flex min-h-[34px] items-center justify-between">
          {chips}
          {topRightSlot}
        </div>
      ) : (
        chips
      )}

      {isCard ? (
        <div className="flex flex-col gap-[12px]">
          {name}
          {divider}
        </div>
      ) : (
        name
      )}

      <div
        className={
          isCard
            ? 'flex flex-col gap-[16px] tablet:flex-row tablet:items-start tablet:justify-between'
            : 'flex flex-col gap-[8px]'
        }
      >
        <div
          className={
            isCard
              ? 'flex items-start gap-[12px]'
              : 'flex items-center gap-[12px]'
          }
        >
          <div
            className={
              isCard
                ? 'flex flex-col items-start'
                : 'flex items-center gap-[8px]'
            }
          >
            <span className="text-md-regular text-gray-500">출발지</span>
            <span className={detailValueClassName}>{displayFromRegion}</span>
          </div>
          <IcArrowRight
            className={
              isCard
                ? 'h-[23px] w-[17px] shrink-0 self-center'
                : 'h-[23px] w-[17px] shrink-0'
            }
          />
          <div
            className={
              isCard
                ? 'flex flex-col items-start'
                : 'flex items-center gap-[8px]'
            }
          >
            <span className="text-md-regular text-gray-500">도착지</span>
            <span className={detailValueClassName}>{displayToRegion}</span>
          </div>
        </div>
        <div
          className={
            isCard ? 'flex flex-col items-start' : 'flex items-center gap-[8px]'
          }
        >
          <span className="text-md-regular text-gray-500">이사일</span>
          <span className={detailValueClassName}>{moveDate}</span>
        </div>
      </div>

      {!isCard && divider}
    </div>
  );
}
