// [메뉴] 내 견적 관리 메뉴 > 결제내역 탭메뉴
// [페이지] 결제내역
// API: GET /payments (커서 기반 무한 스크롤, 최신 결제순)
'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { usePaymentHistoryQuery } from '@/hooks/features/payment/queries/queries';

import { cn } from '@/utils/cn';

import PaymentHistoryCard from '@/components/features/customer/Payment/PaymentHistoryCard';
import Button from '@/components/ui/Button/Button';
import EmptyListNotice from '@/components/ui/EmptyListNotice';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import { Skeleton } from '@/components/ui/Skeleton';

/*
@ 첫 조회 중 자리표시
- PaymentHistoryCard 목록과 같은 틀(2열 그리드)로 그려 데이터가 와도 레이아웃이 튀지 않는다
*/
function PaymentHistorySkeleton() {
  return (
    <div
      aria-busy="true"
      className={cn(
        'mx-auto grid w-full max-w-[1140px] grid-cols-1 gap-[20px]',
        'tablet:gap-[32px]',
        'desktop:grid-cols-2 desktop:gap-[24px]',
      )}
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={220} borderRadius={20} />
      ))}
    </div>
  );
}

export default function EstimatePaymentsPage() {
  const t = useTranslations('Payment');
  const tError = useTranslations('Error');
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
  } = usePaymentHistoryQuery();

  const payments = useMemo(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // 다음 페이지 실패 시 재시도는 버튼으로만 한다 (센티널이 계속 보이면 같은 요청을 반복한다)
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled:
      Boolean(hasNextPage) && !isFetchingNextPage && !isFetchNextPageError,
  });

  return (
    <div
      className={cn(
        'min-h-[calc(100dvh-108px)] bg-background-100',
        'px-[24px] pt-[35px] pb-[64px]',
        'tablet:px-[72px] tablet:pt-[42px] tablet:pb-[96px]',
        'desktop:min-h-[calc(100dvh-168px)] desktop:pt-[60px] desktop:pb-[120px]',
      )}
    >
      {isPending && <PaymentHistorySkeleton />}

      {isError && payments.length === 0 && (
        <div className="flex flex-col items-center gap-[16px] py-[80px]">
          <p className="text-lg-regular text-gray-400">
            {t('historyLoadFailed')}
          </p>
          <Button size="sm" onClick={() => void refetch()}>
            {tError('retry')}
          </Button>
        </div>
      )}

      {!isPending && !isError && payments.length === 0 && (
        <EmptyListNotice message={t('historyEmpty')} />
      )}

      {payments.length > 0 && (
        <div className="mx-auto w-full max-w-[1140px]">
          <p className="mb-[16px] text-lg-semibold text-black-400 tablet:text-xl-semibold">
            {t('historyCount', { count: totalCount })}
          </p>
          <ul
            className={cn(
              'grid grid-cols-1 gap-[20px]',
              'tablet:gap-[32px]',
              'desktop:grid-cols-2 desktop:gap-[24px]',
            )}
          >
            {payments.map((payment) => (
              <li key={payment.paymentId}>
                <PaymentHistoryCard payment={payment} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {isFetchingNextPage && (
        <LoadingDisplay
          fullHeight={false}
          size={40}
          className="mx-auto mt-[24px]"
        />
      )}

      {isFetchNextPageError && (
        <div className="flex flex-col items-center gap-[12px] py-[24px]">
          <p className="text-md-regular text-red-200">{t('nextPageFailed')}</p>
          <Button
            type="button"
            size="sm"
            isLoading={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {tError('retry')}
          </Button>
        </div>
      )}

      {hasNextPage && !isFetchNextPageError && (
        <div ref={sentinelRef} className="h-px w-full" />
      )}
    </div>
  );
}
