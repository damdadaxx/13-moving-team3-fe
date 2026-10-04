// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 탭메뉴
// [페이지] 보낸 견적 조회
// API: GET /estimates?status=PROPOSED,ACCEPTED,NOT_SELECTED (커서 기반 무한 스크롤)
'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyEstimatesQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import SentEstimateCard from '@/components/features/mover/EstimateRequest/SentEstimateCard';
import Button from '@/components/ui/Button/Button';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

const PAGE_SIZE = 10;

export default function MoverEstimateSentPage() {
  const t = useTranslations('MoverEstimates');
  const tError = useTranslations('Error');
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useMyEstimatesQuery({
    status: ['PROPOSED', 'ACCEPTED', 'NOT_SELECTED'],
    size: PAGE_SIZE,
  });

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

  // 다음 페이지 실패 시 재시도는 버튼으로만 한다 (반려 요청 페이지와 같은 이유)
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled:
      Boolean(hasNextPage) && !isFetchingNextPage && !isFetchNextPageError,
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col px-[24px] pt-[24px] pb-[61px]',
        'tablet:px-[78px] tablet:pt-[32px] tablet:pb-[114px]',
        // 1024~1200px 구간에서도 좌우 여백을 두려고 max-w에 여백(24px×2)을 더한다
        'desktop:max-w-[1248px] desktop:px-[24px] desktop:pt-[55px] desktop:pb-[103px]',
      )}
    >
      {isPending && <LoadingDisplay />}

      {isError && items.length === 0 && (
        <p className="py-[40px] text-center text-lg-regular text-red-200">
          {error.message}
        </p>
      )}

      {!isPending && items.length > 0 && (
        <div
          className={cn(
            'grid grid-cols-1 gap-[20px]',
            'tablet:gap-[32px]',
            'desktop:grid-cols-2 desktop:gap-[24px]',
          )}
        >
          {items.map(({ estimateRequest, estimate }) => (
            <SentEstimateCard
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
            priority
          />
          <p className="text-lg-regular text-gray-400 desktop:text-xl-regular">
            {t('sentEmpty')}
          </p>
        </div>
      )}

      {isFetchNextPageError && (
        <div className="flex flex-col items-center gap-[12px] py-[24px]">
          <p className="text-md-regular text-red-200">{t('nextPageFailed')}</p>
          <Button
            type="button"
            size="sm"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {tError('retry')}
          </Button>
        </div>
      )}

      {hasNextPage && !isFetchNextPageError && (
        <div ref={sentinelRef} className="h-[1px] w-full" />
      )}
    </div>
  );
}
