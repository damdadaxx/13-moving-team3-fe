'use client';

import { useCallback, useEffect } from 'react';

import { toCompletedReview } from '@/types/review';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ImgEmpty from '@/assets/images/img_empty.png';

import { ROUTES } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import {
  COMPLETED_REVIEWS_PAGE_SIZE,
  useCompletedReviewsQuery,
} from '@/hooks/queries/reviews/queries';

import CompletedReviewCard from '@/components/customer/reviews/CompletedReviewCard';
import Button from '@/components/ui/Button/Button';
import Pagination from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';

function getPageFromSearch(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get('page'));
  return rawPage > 0 ? rawPage : 1;
}

function CompletedReviewCardSkeleton() {
  return (
    <li>
      <div className="flex w-full flex-col gap-[16px] rounded-[20px] border-[0.5px] border-line-100 bg-gray-50 px-[20px] py-[24px] tablet:gap-[20px] tablet:p-[40px]">
        <div className="flex items-center gap-[12px]">
          <Skeleton width={80} height={80} borderRadius={12} />
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <Skeleton width="40%" height={22} />
            <Skeleton width="80%" height={16} />
          </div>
        </div>
        <Skeleton width="100%" height={48} borderRadius={8} />
        <Skeleton width="70%" height={20} />
      </div>
    </li>
  );
}

export default function CompletedReviewList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = getPageFromSearch(searchParams);
  const buttonSize = useBreakpointValue('sm', 'lg', 'lg');

  const { data, isPending, isError, error } =
    useCompletedReviewsQuery(currentPage);

  const goToPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(nextPage));
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (!data) return;
    if (data.totalPages > 0 && currentPage > data.totalPages) {
      goToPage(data.totalPages);
    }
  }, [currentPage, data, goToPage]);

  if (isError) throw error;

  const reviews =
    data?.list.map(toCompletedReview).filter((review) => review !== null) ?? [];
  const totalPages = data?.totalPages ?? 0;
  const isEmpty = !isPending && reviews.length === 0;

  return (
    <div className="flex min-w-0 flex-col gap-[20px]">
      {isPending && !data ? (
        <ul className="flex flex-col gap-[20px]">
          {Array.from({ length: COMPLETED_REVIEWS_PAGE_SIZE }, (_, index) => (
            <CompletedReviewCardSkeleton key={index} />
          ))}
        </ul>
      ) : isEmpty ? (
        <div className="flex min-h-[calc(100dvh_-_238px)] flex-col items-center justify-center desktop:min-h-[calc(100dvh_-_391px)]">
          <div className="flex flex-col items-center gap-[24px] tablet:gap-[32px]">
            <div className="relative h-[196px] w-[240px] overflow-hidden">
              <div className="absolute top-[-16.29px] left-[-11.04px] size-[260.633px] opacity-50">
                <Image
                  src={ImgEmpty}
                  alt=""
                  fill
                  sizes="261px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-center text-lg-regular text-gray-400 tablet:text-2xl-regular">
              아직 등록된 리뷰가 없어요!
            </p>
            <div className="w-full max-w-[327px] tablet:w-[196px]">
              <Button href={ROUTES.customerReviewsPending} size={buttonSize}>
                리뷰 작성하러 가기
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <ul className="flex min-w-0 flex-col gap-[20px]">
          {reviews.map((review) => (
            <li key={review.id} className="min-w-0">
              <CompletedReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}

      {totalPages >= 1 ? (
        <div className="flex justify-center pt-[40px] desktop:pt-[64px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onClick={goToPage}
          />
        </div>
      ) : null}
    </div>
  );
}
