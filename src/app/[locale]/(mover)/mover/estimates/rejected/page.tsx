// [메뉴] 내 견적 관리 메뉴 > 반려 요청 탭메뉴
// [페이지] 반려 요청
// API: GET /estimates?status=REJECTED (커서 기반 무한 스크롤)
'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useMyEstimatesQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import RejectedRequestCard from '@/components/features/mover/EstimateRequest/RejectedRequestCard';
import Button from '@/components/ui/Button/Button';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

const PAGE_SIZE = 10;

export default function MoverEstimateRejectedPage() {
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

  /*
  @ 다음 페이지 요청 실패 처리
  - isFetchNextPageError일 때도 이미 받은 목록(items)은 유지한다
  - sentinel observer는 재부착하지 않고(enabled: false), 재시도는 버튼으로만 한다
    (그대로 두면 sentinel이 여전히 화면에 보이는 채로 다시 관찰을 시작해
    fetchNextPage를 즉시 반복 호출하게 된다)
  */
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled:
      Boolean(hasNextPage) && !isFetchingNextPage && !isFetchNextPageError,
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col px-[24px] py-[24px]',
        'tablet:px-[72px] py-[32px_77px]',
        'desktop:max-w-[1200px] desktop:py-[54px_84px]',
      )}
    >
      {isPending && <LoadingDisplay />}

      {isError && items.length === 0 && (
        <p className="py-[40px] text-center text-lg-regular text-red-200">
          {error.message}
        </p>
      )}

      {!isPending && items.length > 0 && (
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
            {t('rejectedEmpty')}
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
