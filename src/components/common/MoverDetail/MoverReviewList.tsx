'use client';

import { useState } from 'react';

import type { ReviewSummary } from '@/types/review';

import { useMoverReviewsQuery } from '@/hooks/queries/reviews/queries';

import { cn } from '@/utils/cn';
import {
  formatMaskedReviewerName,
  toRatingDistribution,
} from '@/utils/formatReview';

import MoverReviewItem from '@/components/common/MoverDetail/MoverReviewItem';
import MoverReviewSummary from '@/components/common/MoverDetail/MoverReviewSummary';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import Pagination from '@/components/ui/Pagination';

export default function MoverReviewList({ moverId }: { moverId: string }) {
  const [page, setPage] = useState(1);
  const [currentMoverId, setCurrentMoverId] = useState(moverId);

  /** 기사님 ID가 변경되면 페이지를 초기화 */
  if (currentMoverId !== moverId) {
    setCurrentMoverId(moverId);
    setPage(1);
  }

  const { data, isPending, isError } = useMoverReviewsQuery(moverId, page);
  const totalPages = data?.totalPages ?? 0;

  /** 페이지 번호가 총 페이지 수를 초과하면 총 페이지 수로 설정 */
  if (totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const reviews: ReviewSummary[] = data?.list ?? [];
  const reviewCount = data?.reviewCount ?? 0;
  const distribution = toRatingDistribution(data?.ratingDistribution ?? []);

  /** 리뷰 목록 렌더링 */
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <div className="flex flex-col gap-[16px]">
        <h2
          className={cn(
            'text-lg-semibold text-black-400',
            'tablet:text-xl-semibold',
          )}
        >
          리뷰
        </h2>
        {data ? (
          <MoverReviewSummary
            averageRating={data.ratingAvg}
            reviewCount={reviewCount}
            distribution={distribution}
          />
        ) : null}
      </div>

      {isPending && !data ? (
        <LoadingDisplay size={40} fullHeight={false} className="py-[40px]" />
      ) : isError ? (
        <p className="py-[40px] text-center text-lg-regular text-gray-400">
          리뷰를 불러오지 못했어요.
        </p>
      ) : reviews.length === 0 ? (
        <p className="py-[40px] text-center text-lg-regular text-gray-400">
          아직 등록된 리뷰가 없어요!
        </p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li
              key={review.id}
              className={cn(
                index < reviews.length - 1 && 'border-b border-line-100',
              )}
            >
              <MoverReviewItem
                nickname={formatMaskedReviewerName(review.customerName)}
                createdAt={review.createdAt}
                rating={review.rating}
                content={review.content}
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <Pagination
          className={cn(
            'mt-[8px] justify-center',
            'tablet:mt-[30px]',
            'desktop:mt-[32px]',
          )}
          currentPage={page}
          totalPages={totalPages}
          onClick={setPage}
        />
      ) : null}
    </div>
  );
}
