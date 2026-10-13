// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// [페이지] 받았던 견적
// Figma: 받았던 견적 Desktop(1:11657) · Tablet(1:11359) · Mobile(1:11510)
// API: GET /estimates?status=closed (ACCEPTED,NOT_SELECTED,EXPIRED)
//
// 요청 1건의 내용은 EstimateRequestBlock이 그린다. 여기서는 조회·페이지네이션과
// 로딩/에러/빈 목록 분기만 맡는다.
'use client';

import { Fragment } from 'react';

import type { MyEstimateListQuery } from '@/types/estimate';
import { useTranslations } from 'next-intl';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyEstimatesQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import EstimateRequestBlock from '@/components/features/customer/ReceivedEstimate/EstimateRequestBlock';
import EmptyListNotice from '@/components/ui/EmptyListNotice';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import { Skeleton } from '@/components/ui/Skeleton';

/** status=closed와 같은 범위. 백엔드 paginationSchema 기본 size에 맞춘다 */
const RECEIVED_ESTIMATES_QUERY: MyEstimateListQuery = {
  status: ['ACCEPTED', 'NOT_SELECTED', 'EXPIRED'],
  size: 10,
};

/*
@ 첫 조회 중 자리표시
- EstimateRequestBlock과 같은 틀(카드 · desktop 좌우 분할)로 그려 데이터가 와도 레이아웃이 튀지 않는다
*/
function EstimateRequestBlockSkeleton() {
  return (
    <div
      aria-busy="true"
      className={cn(
        'mx-auto w-full max-w-[1120px] bg-gray-50 px-[24px] pt-[32px] pb-[24px]',
        'tablet:rounded-[16px] tablet:px-[28px] tablet:py-[32px]',
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
        <div className="flex flex-col gap-[12px] desktop:w-[260px] desktop:shrink-0">
          <Skeleton width="40%" height={24} />
          <Skeleton width="100%" height={18} />
          <Skeleton width="100%" height={18} />
          <Skeleton width="100%" height={18} />
          <Skeleton width="70%" height={18} />
        </div>

        <div className="flex min-w-px flex-1 flex-col gap-[16px] desktop:gap-[20px]">
          <Skeleton width={120} height={26} />
          <Skeleton width={120} height={40} borderRadius={8} />
          <Skeleton width="100%" height={140} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}

export default function EstimateReceivedPage() {
  const t = useTranslations('CustomerEstimates');
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyEstimatesQuery(RECEIVED_ESTIMATES_QUERY);

  const items = data?.pages.flatMap((page) => page.list) ?? [];

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <div className="min-h-[calc(100dvh-108px)] bg-gray-50 tablet:bg-background-100 desktop:min-h-[calc(100dvh-168px)]">
      <div
        className={cn(
          'mx-auto flex w-full flex-col',
          'tablet:gap-[16px] tablet:px-[72px] tablet:py-[32px]',
          'desktop:gap-[40px] desktop:py-[64px]',
        )}
      >
        {isPending &&
          Array.from({ length: 2 }, (_, index) => (
            <EstimateRequestBlockSkeleton key={index} />
          ))}

        {isError && <EmptyListNotice message={t('listLoadFailed')} />}

        {!isPending && !isError && items.length === 0 && (
          <EmptyListNotice message={t('receivedEmpty')} />
        )}

        {items.map((item, index) => (
          <Fragment key={item.estimateRequest.estimateRequestId}>
            {/* mobile은 카드가 없어서 8px 회색 띠로 요청 사이를 나눈다 */}
            {index > 0 && (
              <div aria-hidden className="h-[8px] bg-line-100 tablet:hidden" />
            )}
            <EstimateRequestBlock item={item} />
          </Fragment>
        ))}

        {isFetchingNextPage && (
          <LoadingDisplay fullHeight={false} size={40} className="mx-auto" />
        )}
        {hasNextPage && <div ref={sentinelRef} className="h-px w-full" />}
      </div>
    </div>
  );
}
