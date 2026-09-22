'use client';

import { useCallback, useEffect, useState } from 'react';

import type { PendingReview } from '@/types/review';
import { toPendingReview } from '@/types/review';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ImgEmpty from '@/assets/images/img_empty.png';

import {
  PENDING_REVIEWS_PAGE_SIZE,
  usePendingReviewsQuery,
} from '@/hooks/queries/reviews/queries';

import PendingReviewCard from '@/components/reviews/PendingReviewCard';
import WriteReviewModal from '@/components/reviews/WriteReviewModal';
import Pagination from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';

function getPageFromSearch(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get('page'));
  return rawPage > 0 ? rawPage : 1;
}

//리뷰 카드 스켈레톤 적용
function PendingReviewCardSkeleton() {
  return (
    <li>
      <div className="flex w-full flex-col gap-[20px] rounded-[20px] border-[0.5px] border-line-100 bg-gray-50 px-[20px] py-[24px] tablet:p-[32px] desktop:px-[40px] desktop:py-[32px]">
        <div className="flex items-center gap-[12px]">
          <Skeleton width={64} height={64} borderRadius={12} />
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <Skeleton width="40%" height={22} />
            <Skeleton width="80%" height={16} />
          </div>
        </div>
        <Skeleton width="100%" height={54} borderRadius={12} />
      </div>
    </li>
  );
}

export default function PendingReviewList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = getPageFromSearch(searchParams);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(
    null,
  );

  const { data, isPending, isError, error } =
    usePendingReviewsQuery(currentPage);

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

  const reviews = data?.list.map(toPendingReview) ?? [];
  const totalPages = data?.totalPages ?? 0;
  const isEmpty = !isPending && reviews.length === 0;

  return (
    <div className="flex flex-col gap-[20px]">
      {isPending && !data ? (
        <ul className="flex flex-col gap-[20px]">
          {Array.from({ length: PENDING_REVIEWS_PAGE_SIZE }, (_, index) => (
            <PendingReviewCardSkeleton key={index} />
          ))}
        </ul>
      ) : isEmpty ? (
        <div className="flex min-h-[calc(100dvh_-_238px)] flex-col items-center justify-center desktop:min-h-[calc(100dvh_-_391px)]">
          <div className="flex flex-col items-center gap-[24px] tablet:gap-[32px]">
            <div className="relative h-[196px] w-[240px] overflow-hidden">
              <div className="absolute top-[-16.29px] left-[-11.04px] size-[260.633px] opacity-50">
                <Image
                  src={ImgEmpty}
                  alt="빈 리뷰 이미지"
                  fill
                  sizes="261px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-lg-regular text-center text-gray-400 tablet:text-2xl-regular">
              작성 가능한 리뷰가 없어요!
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-[20px]">
          {reviews.map((review) => (
            <li key={review.id}>
              <PendingReviewCard review={review} onWrite={setSelectedReview} />
            </li>
          ))}
        </ul>
      )}

      {totalPages >= 1 ? (
        <div className="flex justify-center pt-[28px] desktop:pt-[64px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onClick={goToPage}
          />
        </div>
      ) : null}

      <WriteReviewModal
        review={selectedReview}
        isOpen={selectedReview !== null}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}
