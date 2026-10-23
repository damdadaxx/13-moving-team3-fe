// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 대기중인 견적
// Figma: 대기 중인 견적 Desktop(510:40184) · Tablet(510:40155) · Mobile(510:40211)
//
// 화면 전체를 GET /estimate-requests/active 한 번으로 그린다.
// (진행 중인 요청과 거기 들어온 견적 목록을 함께 내려주는 엔드포인트)
'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useToast } from '@/hooks/common/useToast';
import { useAcceptEstimateMutation } from '@/hooks/features/estimate/queries/mutations';
import { useActiveEstimateRequestQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import DesignatedEstimateCard from '@/components/features/customer/Estimate/DesignatedEstimateCard';
import EstimateRequestHeader from '@/components/features/customer/Estimate/EstimateRequestHeader';
import PendingEstimateCard from '@/components/features/customer/Estimate/PendingEstimateCard';
import EmptyListNotice from '@/components/ui/EmptyListNotice';
import EmptyState from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

/*
@ 첫 조회 중 자리표시
- EstimateRequestHeader(요약 바)와 견적 카드 목록 자리를 같은 틀로 그린다
*/
function EstimatePendingSkeleton() {
  return (
    <div
      aria-busy="true"
      className={cn(
        'min-h-[calc(100dvh-108px)] bg-background-100',
        'desktop:min-h-[calc(100dvh-168px)]',
      )}
    >
      <div
        className={cn(
          'bg-gray-50 p-[24px]',
          'tablet:px-[72px] tablet:py-[32px]',
        )}
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[12px]">
          <Skeleton width={120} height={28} />
          <Skeleton width={160} height={18} />
          <Skeleton width="100%" height={48} />
        </div>
      </div>

      <div
        className={cn(
          'px-[24px] pt-[35px] pb-[64px]',
          'tablet:px-[72px] tablet:pt-[42px] tablet:pb-[96px]',
          'desktop:pt-[78px] desktop:pb-[120px]',
        )}
      >
        <div
          className={cn(
            'mx-auto grid w-full max-w-[1140px] gap-[20px]',
            'tablet:gap-[32px]',
            'desktop:grid-cols-2 desktop:gap-[24px]',
          )}
        >
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} height={280} borderRadius={20} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EstimatePendingPage() {
  const t = useTranslations('CustomerEstimates');
  const tConfirm = useTranslations('EstimateConfirm');
  const tError = useTranslations('Error');
  const activeQuery = useActiveEstimateRequestQuery();
  const acceptEstimate = useAcceptEstimateMutation();
  const router = useRouter();
  const { showToast } = useToast();

  /*
  @ 견적 확정
  - 실패하면 버튼이 조용히 원래대로 돌아가 확정됐는지 알 수 없으므로 토스트로 알린다
  */
  function handleConfirm(estimateId: string) {
    acceptEstimate.mutate(estimateId, {
      // 확정하면 바로 견적 상세로 보내 선수금을 결제하게 한다
      onSuccess: () => router.push(`${ROUTES.customerEstimates}/${estimateId}`),
      onError: (error) => {
        showToast(
          error instanceof HttpError ? error.message : tConfirm('failedRetry'),
        );
      },
    });
  }

  if (activeQuery.isPending) return <EstimatePendingSkeleton />;

  if (activeQuery.isError) {
    return (
      <EmptyState
        fit="tab"
        message={t('loadFailed')}
        buttonLabel={tError('retry')}
        onClick={() => activeQuery.refetch()}
      />
    );
  }

  const activeRequest = activeQuery.data;

  if (!activeRequest) {
    return (
      <EmptyState
        fit="tab"
        message={t('noActiveRequest')}
        buttonLabel={t('goRequest')}
        href={ROUTES.customerHome}
      />
    );
  }

  /*
  @ PROPOSED + DESIGNATED만 남긴다
  - PROPOSED: 기사님이 금액을 보낸 견적 (확정 가능)
  - DESIGNATED: 고객이 지정 견적을 요청했지만 기사님이 아직 답하지 않은 요청 (금액 없음, 확정 불가)
  - 반려(REJECTED)는 '반려된 요청' 탭에서 보여준다.
  - 확정하면 고른 견적은 ACCEPTED, 나머지는 NOT_SELECTED가 되어 이 목록에서 빠진다.
  */
  const pendingEstimates = activeRequest.estimates.filter(
    (estimate) =>
      estimate.status === 'PROPOSED' ||
      // 확정된 뒤에는 답이 없던 지정 요청을 숨긴다 (백엔드는 DESIGNATED 행을 그대로 남겨 둔다)
      (estimate.status === 'DESIGNATED' &&
        activeRequest.status !== 'CONFIRMED'),
  );
  // 지정 견적(답변 대기)을 위로 올린다. sort는 안정 정렬이라 나머지 순서는 그대로다
  pendingEstimates.sort(
    (a, b) =>
      Number(b.status === 'DESIGNATED') - Number(a.status === 'DESIGNATED'),
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
          <EmptyListNotice
            message={
              activeRequest.status === 'CONFIRMED'
                ? t('confirmedNotice')
                : t('waiting')
            }
          />
        ) : (
          <ul
            className={cn(
              'mx-auto grid w-full max-w-[1140px] gap-[20px]',
              'tablet:gap-[32px]',
              'desktop:grid-cols-2 desktop:gap-[24px]',
            )}
          >
            {pendingEstimates.map((estimate) => (
              <li key={estimate.id} className="flex">
                {estimate.status === 'DESIGNATED' ? (
                  <DesignatedEstimateCard
                    estimate={estimate}
                    serviceType={activeRequest.serviceType}
                  />
                ) : (
                  <PendingEstimateCard
                    estimate={estimate}
                    serviceType={activeRequest.serviceType}
                    onConfirm={handleConfirm}
                    isConfirming={
                      acceptEstimate.isPending &&
                      acceptEstimate.variables === estimate.id
                    }
                    isDisabled={acceptEstimate.isPending}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
