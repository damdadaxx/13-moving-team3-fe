// [메뉴] 내 견적 관리 메뉴 > 대기 중인 견적
// 기사님이 보낸 견적 카드 (Figma: Card-list/대기중인내역
//   Desktop·Tablet 510:43164 · Mobile 510:43215)
//
// mobile: 버튼이 세로로 쌓이고 각각 전체 너비 (견적 확정하기가 위, 상세보기가 아래)
// tablet~: 버튼이 가로로 나란히 절반씩 (상세보기가 왼쪽, 견적 확정하기가 오른쪽)
// DOM 순서는 mobile 기준(견적 확정하기 먼저)으로 두고 tablet부터 order로 시각 순서를 뒤집는다
'use client';

import type { Estimate } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import EstimateCard from '@/components/ui/EstimateCard';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

import MoverSummary from './MoverSummary';

interface PendingEstimateCardProps {
  estimate: Estimate;
  /** 이사 유형은 견적이 아니라 견적 요청에 달려 있어 따로 받는다 */
  serviceType: ServiceType;
  onConfirm: (estimateId: string) => void;
  isConfirming?: boolean;
}

export default function PendingEstimateCard({
  estimate,
  serviceType,
  onConfirm,
  isConfirming = false,
}: PendingEstimateCardProps) {
  const tagSize = useBreakpointValue(
    'sm' as const,
    'md' as const,
    'md' as const,
  );
  const { mover } = estimate;

  return (
    <EstimateCard className="gap-[28px] tablet:gap-[40px] desktop:gap-[40px]">
      {/* 한 줄 소개 길이가 달라 카드 높이가 벌어져도 버튼 줄은 아래에 붙여둔다 */}
      <div
        className={cn(
          'flex w-full flex-1 flex-col gap-[8px]',
          'tablet:gap-[12px]',
        )}
      >
        <div className={cn('flex flex-col gap-[16px]', 'tablet:gap-[24px]')}>
          <div
            className={cn(
              'flex items-center justify-between',
              'tablet:h-[34px]',
            )}
          >
            <div className="flex items-center gap-[8px]">
              <ServiceTypeTag
                variant="service"
                serviceType={serviceType}
                size={tagSize}
              />
              {estimate.isDesignated && (
                <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
              )}
            </div>
            {/* 목록에는 PROPOSED 견적만 올라오므로 상태는 항상 "견적대기"다 */}
            <span className="text-lg-semibold px-[8px] text-gray-300">
              견적대기
            </span>
          </div>

          <div className="flex flex-col gap-[4px]">
            <p
              className={cn(
                'text-lg-semibold text-black-300',
                'tablet:text-2lg-semibold',
              )}
            >
              {estimate.comment}
            </p>

            <MoverSummary
              name={mover.nickname}
              imgUrl={mover.imgUrl}
              likeCount={mover.likeCount}
              averageRating={mover.averageRating}
              reviewCount={mover.reviewCount}
              careerMonths={mover.careerMonths}
              confirmedCount={mover.confirmedEstimateCount}
            />
          </div>
        </div>

        <div className={cn('flex h-[47px] items-end', 'tablet:h-[52px]')}>
          <div className="flex w-full items-center justify-between">
            <span
              className={cn(
                'text-md-medium text-gray-300',
                'tablet:text-lg-medium tablet:text-black-400',
              )}
            >
              견적 금액
            </span>
            <span
              className={cn(
                'text-xl-bold text-black-400',
                'tablet:text-2xl-bold',
              )}
            >
              {estimate.price?.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* tablet부터는 grid로 나눈다. flex-1은 outlined(px-6+테두리)와 solid(p-4)의
          여백 차이만큼 두 버튼 폭이 갈려서 시안의 반반이 되지 않는다 */}
      <div
        className={cn(
          'flex w-full flex-col gap-[11px]',
          'tablet:grid tablet:grid-cols-2',
        )}
      >
        <Button
          size="sm"
          className="tablet:order-2"
          isLoading={isConfirming}
          onClick={() => onConfirm(estimate.id)}
        >
          견적 확정하기
        </Button>
        <Button
          variant="outlined"
          size="sm"
          className="tablet:order-1"
          href={`/customer/estimates/pending/${estimate.id}`}
        >
          상세보기
        </Button>
      </div>
    </EstimateCard>
  );
}
