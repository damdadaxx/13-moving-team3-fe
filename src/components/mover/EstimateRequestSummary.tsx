// 견적 요청 정보 요약 (칩 + 이름 + 구분선 + 출발지/도착지/이사일)
// SendEstimateModal / RejectRequestModal / ReceivedRequestCard에서 공유한다
'use client';

import type { ServiceType } from '@/types/serviceType';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import formatRegion from '@/utils/formatRegion';

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
    출발지·도착지·이사일은 라벨 위/값 아래 (Figma Component/modal 1:10684).
    화살표는 값 줄에 맞춘다(items-end). 시안 고정폭 201px은 쓰지 않는다 —
    formatRegion 결과가 샘플보다 길 수 있다.
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

  return (
    <div
      className={
        isCard
          ? 'flex flex-col gap-[16px] desktop:gap-[24px]'
          : 'flex flex-col gap-[16px] desktop:gap-[20px]'
      }
    >
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
            : 'flex flex-col gap-[8px] desktop:flex-row desktop:items-start desktop:gap-[48px]'
        }
      >
        <div
          className={
            isCard ? 'flex items-start gap-[12px]' : 'flex items-end gap-[12px]'
          }
        >
          <DetailField
            label="출발지"
            value={formatRegion(fromRegion)}
            valueClassName={detailValueClassName}
          />
          <IcArrowRight
            className={
              isCard
                ? 'h-[23px] w-[17px] shrink-0 self-center'
                : 'h-[23px] w-[17px] shrink-0'
            }
          />
          <DetailField
            label="도착지"
            value={formatRegion(toRegion)}
            valueClassName={detailValueClassName}
          />
        </div>
        <DetailField
          label="이사일"
          value={moveDate}
          valueClassName={detailValueClassName}
        />
      </div>

      {!isCard && divider}
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
  valueClassName: string;
}

function DetailField({ label, value, valueClassName }: DetailFieldProps) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-md-regular text-gray-500">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
