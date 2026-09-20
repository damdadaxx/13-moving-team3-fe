// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 대기중인 견적
// Figma: 대기 중인 견적 Desktop(510:40184) · Tablet(510:40155) · Mobile(510:40211)
//
// 화면 전체를 GET /estimate-requests/active 한 번으로 그린다.
// (진행 중인 요청과 거기 들어온 견적 목록을 함께 내려주는 엔드포인트)
'use client';

import { ROUTES } from '@/lib/constants/routes';

import { useAcceptEstimateMutation } from '@/hooks/queries/estimate/mutations';
import { useActiveEstimateRequestQuery } from '@/hooks/queries/estimate/queries';

import { cn } from '@/utils/cn';

import EstimateRequestHeader from '@/components/customer/estimates/EstimateRequestHeader';
import PendingEstimateCard from '@/components/customer/estimates/PendingEstimateCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function EstimatePendingPage() {
  const activeQuery = useActiveEstimateRequestQuery();
  const acceptEstimate = useAcceptEstimateMutation();

  if (activeQuery.isPending) return <LoadingDisplay />;

  if (activeQuery.isError) {
    return (
      <EmptyState
        message="견적 정보를 불러오지 못했어요."
        buttonLabel="다시 시도"
        onClick={() => activeQuery.refetch()}
      />
    );
  }

  const activeRequest = activeQuery.data;

  if (!activeRequest) {
    return (
      <EmptyState
        message="진행 중인 견적 요청이 없어요."
        buttonLabel="견적 요청하러 가기"
        href={ROUTES.customerHome}
      />
    );
  }

  /*
  @ PROPOSED만 남긴다
  - active 응답에는 아직 금액이 없는 지정 견적(DESIGNATED)과 반려(REJECTED)도 섞여 있다.
  - 확정하면 고른 견적은 ACCEPTED, 나머지는 NOT_SELECTED가 되어 이 목록에서 빠진다.
  */
  const pendingEstimates = activeRequest.estimates.filter(
    (estimate) => estimate.status === 'PROPOSED',
  );

  return (
    <div
      className={cn(
        'min-h-[calc(100dvh-108px)] bg-background-100',
        'desktop:min-h-[calc(100dvh-168px)]',
      )}
    >
      <EstimateRequestHeader
        serviceType={activeRequest.serviceType}
        requestedAt={activeRequest.createdAt}
        departureAddress={activeRequest.departureAddress}
        arrivalAddress={activeRequest.arrivalAddress}
        moveDate={activeRequest.moveDate}
      />

      <div
        className={cn(
          'px-[24px] pt-[35px] pb-[64px]',
          'tablet:px-[72px] tablet:pt-[42px] tablet:pb-[96px]',
          'desktop:pt-[78px] desktop:pb-[120px]',
        )}
      >
        {pendingEstimates.length === 0 ? (
          <p className="text-lg-regular text-center text-gray-400 tablet:text-2xl-regular">
            {activeRequest.status === 'CONFIRMED'
              ? '견적을 확정했어요. 받았던 견적에서 확인할 수 있어요.'
              : '아직 도착한 견적이 없어요. 조금만 기다려 주세요.'}
          </p>
        ) : (
          <ul
            className={cn(
              'mx-auto grid w-full max-w-[1140px] gap-[20px]',
              'tablet:gap-[32px]',
              'desktop:grid-cols-2 desktop:gap-[24px]',
            )}
          >
            {pendingEstimates.map((estimate) => (
              <li key={estimate.id ?? estimate.estimateId} className="flex">
                <PendingEstimateCard
                  estimate={estimate}
                  serviceType={activeRequest.serviceType}
                  onConfirm={acceptEstimate.mutate}
                  isConfirming={
                    acceptEstimate.isPending &&
                    acceptEstimate.variables ===
                      (estimate.id ?? estimate.estimateId)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
