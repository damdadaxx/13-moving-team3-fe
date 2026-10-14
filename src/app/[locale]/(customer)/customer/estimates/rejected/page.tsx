// [메뉴] 내 견적 관리 메뉴 > 반려된 요청 탭메뉴
// [페이지] 반려된 요청
// API: GET /estimate-requests/active (estimates 중 status=REJECTED)
//
// 기사님이 반려한 지정 견적 요청이다. GET /estimates는 백엔드가 고객에게 REJECTED를
// 숨기므로, 진행 중인 요청에 딸려오는 반려 건만 보여준다 (지난 요청의 반려는 조회 불가)
'use client';

import { useTranslations } from 'next-intl';

import { useActiveEstimateRequestQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import RejectedEstimateCard from '@/components/features/customer/Estimate/RejectedEstimateCard';
import EmptyListNotice from '@/components/ui/EmptyListNotice';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function EstimateRejectedPage() {
  const t = useTranslations('CustomerEstimates');
  const tError = useTranslations('Error');
  const activeQuery = useActiveEstimateRequestQuery();

  if (activeQuery.isPending) return <LoadingDisplay />;

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
  const rejectedEstimates =
    activeRequest?.estimates.filter(
      (estimate) => estimate.status === 'REJECTED',
    ) ?? [];

  if (!activeRequest || rejectedEstimates.length === 0) {
    return (
      <EmptyListNotice
        message={t('rejectedEmpty')}
        className="min-h-[calc(100dvh-108px)] bg-background-100 desktop:min-h-[calc(100dvh-168px)]"
      />
    );
  }

  return (
    <div
      className={cn(
        'min-h-[calc(100dvh-108px)] bg-background-100',
        'px-[24px] pt-[35px] pb-[64px]',
        'tablet:px-[72px] tablet:pt-[42px] tablet:pb-[96px]',
        'desktop:min-h-[calc(100dvh-168px)] desktop:pt-[78px] desktop:pb-[120px]',
      )}
    >
      <ul
        className={cn(
          'mx-auto grid w-full max-w-[1140px] gap-[20px]',
          'tablet:gap-[32px]',
          'desktop:grid-cols-2 desktop:gap-[24px]',
        )}
      >
        {rejectedEstimates.map((estimate) => (
          <li key={estimate.id} className="flex">
            <RejectedEstimateCard
              estimate={estimate}
              serviceType={activeRequest.serviceType}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
