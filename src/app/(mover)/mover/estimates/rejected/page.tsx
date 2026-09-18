// [메뉴] 내 견적 관리 메뉴 > 반려 요청 탭메뉴
// [페이지] 반려 요청
// API: GET /estimates?status=REJECTED (커서 기반 무한 스크롤)
'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyEstimatesQuery } from '@/hooks/queries/estimate/queries';

import { cn } from '@/utils/cn';

import RejectedRequestCard from '@/components/mover/RejectedRequestCard';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

const PAGE_SIZE = 10;

export default function MoverEstimateRejectedPage() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyEstimatesQuery({ status: 'REJECTED', size: PAGE_SIZE });

  const items = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.list.flatMap((group) =>
          group.estimates.map((estimate) => ({
            estimateRequest: group.estimateRequest,
            estimate,
          })),
        ),
      ) ?? [],
    [data],
  );

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col px-[30px] py-[40px]',
        'tablet:px-[72px]',
        'desktop:max-w-[1200px] desktop:py-[69px]',
      )}
    >
      {isPending && <LoadingDisplay />}

      {isError && (
        <p className="py-[40px] text-center text-lg-regular text-red-200">
          {error.message}
        </p>
      )}

      {!isPending && !isError && items.length > 0 && (
        <div className="grid grid-cols-1 gap-[24px] desktop:grid-cols-2">
          {items.map(({ estimateRequest, estimate }) => (
            <RejectedRequestCard
              key={estimate.estimateId}
              estimateRequest={estimateRequest}
              estimate={estimate}
            />
          ))}
        </div>
      )}

      {!isPending && !isError && items.length === 0 && (
        <div
          className={cn(
            'flex flex-col items-center pt-[80px]',
            'desktop:gap-[32px] desktop:pt-[180px]',
          )}
        >
          <Image
            src={ImgEmptyBeaver}
            alt=""
            width={240}
            height={240}
            className="size-[240px] object-contain"
            aria-hidden
            loading="eager"
            priority
          />
          <p className="text-lg-regular text-gray-400 desktop:text-xl-regular">
            반려한 요청이 없어요!
          </p>
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className="h-[1px] w-full" />}
    </div>
  );
}
