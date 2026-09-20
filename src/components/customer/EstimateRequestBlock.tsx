// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// Figma: 받았던 견적 Desktop(1:11661) · Tablet(1:11364) · Mobile(1:11515)
//
// 견적 요청 1건 블록 (견적 정보 + 그 요청으로 받은 견적서 목록)
/*
@ 상태 필터
- 요청마다 따로 걸리므로 목록이 아니라 이 블록이 state를 갖는다
- 이미 받아온 견적서 배열만 거르면 되는 필터라 서버에 다시 묻지 않는다

@ 브레이크포인트별 차이
- mobile: 카드 없이 전체 너비 / tablet·desktop: 흰 카드
- desktop만 견적 정보와 목록이 세로 구분선을 사이에 두고 좌우로 나뉜다
*/
'use client';

import { useState } from 'react';

import type { EstimateListItem, EstimateStatusFilter } from '@/types/estimate';

import { cn } from '@/utils/cn';

import EstimateInfoSummary from '@/components/customer/EstimateInfoSummary';
import ReceivedEstimateCard from '@/components/customer/ReceivedEstimateCard';
import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';

const STATUS_FILTER_OPTIONS: DropdownOption<EstimateStatusFilter>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CONFIRMED', label: '확정견적' },
  { value: 'PENDING', label: '견적대기' },
];

interface EstimateRequestBlockProps {
  item: EstimateListItem;
}

export default function EstimateRequestBlock({
  item,
}: EstimateRequestBlockProps) {
  const [statusFilter, setStatusFilter] = useState<EstimateStatusFilter>('ALL');
  const { estimateRequest, estimates } = item;

  const visibleEstimates =
    statusFilter === 'ALL'
      ? estimates
      : estimates.filter(
          (estimate) =>
            (estimate.status === 'ACCEPTED') === (statusFilter === 'CONFIRMED'),
        );

  return (
    <section
      className={cn(
        'bg-gray-50 px-[24px] pt-[32px] pb-[24px]',
        'tablet:rounded-[16px] tablet:px-[28px] tablet:py-[32px]',
        'tablet:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.2),2px_2px_10px_0_rgba(220,220,220,0.2)]',
        'desktop:px-[40px] desktop:py-[44px]',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-[28px]',
          'tablet:gap-[40px]',
          'desktop:flex-row desktop:gap-[60px]',
        )}
      >
        <div className="desktop:w-[260px] desktop:shrink-0">
          <EstimateInfoSummary
            serviceType={estimateRequest.serviceType}
            fromAddress={estimateRequest.departureAddress}
            toAddress={estimateRequest.arrivalAddress}
            moveDate={estimateRequest.moveDate}
            requestedAt={estimateRequest.requestedAt}
          />
        </div>

        <div
          aria-hidden
          className="hidden w-px self-stretch bg-line-100 desktop:block"
        />

        <div className="flex min-w-px flex-1 flex-col gap-[16px] desktop:gap-[20px]">
          <h2 className="flex items-center gap-[8px] text-2lg-semibold text-black-400 tablet:text-xl-semibold">
            견적서 목록
            <span className="text-orange-400">{visibleEstimates.length}</span>
          </h2>

          <div className="flex flex-col desktop:gap-[20px]">
            <Dropdown
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              aria-label="견적서 상태 필터"
              className="self-start"
            />

            {visibleEstimates.length > 0 ? (
              <div className="flex flex-col">
                {visibleEstimates.map((estimate) => (
                  <ReceivedEstimateCard
                    key={estimate.estimateId ?? estimate.id}
                    estimate={estimate}
                    serviceType={estimateRequest.serviceType}
                  />
                ))}
              </div>
            ) : (
              <p className="py-[40px] text-center text-lg-regular text-gray-400">
                조건에 맞는 견적서가 없어요.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
