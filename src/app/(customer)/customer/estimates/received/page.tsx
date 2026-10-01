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

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyEstimatesQuery } from '@/hooks/queries/estimate/queries';

import { cn } from '@/utils/cn';

import EstimateRequestBlock from '@/components/features/customer/ReceivedEstimate/EstimateRequestBlock';
import EmptyListNotice from '@/components/ui/EmptyListNotice';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/** status=closed와 같은 범위. 백엔드 paginationSchema 기본 size에 맞춘다 */
const RECEIVED_ESTIMATES_QUERY: MyEstimateListQuery = {
  status: ['ACCEPTED', 'NOT_SELECTED', 'EXPIRED'],
  size: 10,
};

export default function EstimateReceivedPage() {
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
        {isPending && <LoadingDisplay />}

        {isError && (
          <EmptyListNotice message="견적을 불러오지 못했어요. 잠시 후 다시 시도해주세요." />
        )}

        {!isPending && !isError && items.length === 0 && (
          <EmptyListNotice message="아직 받았던 견적이 없어요!" />
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
