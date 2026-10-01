'use client';

import type { CompletedReview } from '@/types/review';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IcDriverMark from '@/assets/icons/ic_mover_badge.svg';
import ImgMoverCharacter from '@/assets/images/img_profile_example.png';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import StarRating from '@/components/ui/StarRating';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

interface CompletedReviewCardProps {
  review: CompletedReview;
}

function formatWrittenDate(date: string) {
  const formatted = formatDate(date, 'review');
  return formatted.replaceAll('-', '. ');
}

function formatMoveDateMobile(date: string) {
  const formatted = formatDate(date, 'korean');
  return formatted.replace(/\s*\([^)]*\)\s*$/, '');
}

function MobileMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs-regular text-gray-500">{label}</span>
      <span className="text-sm-medium whitespace-nowrap text-black-100">
        {value}
      </span>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-md-regular text-gray-500">{label}</span>
      <span className="text-md-medium whitespace-nowrap text-black-100">
        {value}
      </span>
    </div>
  );
}

function MetaDivider() {
  return (
    <span
      aria-hidden="true"
      className="h-[50px] w-0 shrink-0 border-l border-line-200"
    />
  );
}

function ServiceTags({
  serviceType,
  isDesignated,
}: {
  serviceType: CompletedReview['serviceType'];
  isDesignated: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[8px]">
      <ServiceTypeTag variant="service" serviceType={serviceType} size="sm" />
      {isDesignated ? (
        <ServiceTypeTag variant="designatedEstimate" size="sm" />
      ) : null}
    </div>
  );
}

export default function CompletedReviewCard({
  review,
}: CompletedReviewCardProps) {
  const router = useRouter();
  const profileImageSrc = review.imgUrl ?? ImgMoverCharacter;
  const moveDate = formatDate(review.moveDate, 'korean');
  const moveDateMobile = formatMoveDateMobile(review.moveDate);
  const writtenDate = formatWrittenDate(review.createdAt);

  const goToMover = () => {
    router.push(`/mover/${review.moverId}`);
  };

  return (
    <article
      className={cn(
        'flex min-w-0 w-full flex-col overflow-hidden rounded-[20px] border-[0.5px] border-line-100 bg-gray-50',
        'shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]',
        'px-[20px] py-[24px] gap-[16px]',
        'tablet:gap-[20px] tablet:p-[40px]',
      )}
    >
      {/* 모바일 */}
      <div className="flex min-w-0 flex-col gap-[16px] tablet:hidden">
        <div className="flex w-full flex-col gap-[12px]">
          <ServiceTags
            serviceType={review.serviceType}
            isDesignated={review.isDesignated}
          />
          <button
            type="button"
            className="group flex w-full min-w-0 items-center justify-between text-left cursor-pointer"
            onClick={goToMover}
          >
            <div className="flex min-w-0 flex-col items-start gap-[4px]">
              <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center">
                <IcDriverMark aria-hidden="true" />
              </span>
              <p className="flex min-w-0 items-center gap-[4px] text-lg-semibold text-black-300 group-hover:underline">
                <span className="min-w-0 break-all">{review.moverName}</span>
                <span className="shrink-0">기사님</span>
              </p>
            </div>
            <div className="relative size-[50px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
              <Image
                src={profileImageSrc}
                alt={`${review.moverName} 기사님 프로필`}
                fill
                unoptimized={typeof profileImageSrc === 'string'}
                className="object-cover object-[center_20%]"
                sizes="50px"
              />
            </div>
          </button>
        </div>
        <div className="h-px w-full bg-line-100" />
        <div className="flex min-w-0 items-center gap-[16px]">
          <MobileMetaItem label="출발지" value={review.fromRegion} />
          <MobileMetaItem label="도착지" value={review.toRegion} />
          <MobileMetaItem label="이사일" value={moveDateMobile} />
        </div>
        <div className="h-px w-full bg-line-100" />
        <div className="flex w-full flex-col gap-[12px]">
          <StarRating value={review.rating} readOnly size={20} />
          <p className="whitespace-pre-wrap text-lg-medium text-black-400">
            {review.content}
          </p>
        </div>
        <div className="flex items-center justify-end gap-[6px] text-xs-regular text-gray-300">
          <span>작성일</span>
          <span>{writtenDate}</span>
        </div>
      </div>

      {/* 태블릿,데스크탑 */}
      <div className="hidden min-w-0 flex-col gap-[20px] tablet:flex">
        <button
          type="button"
          className="group flex min-w-0 items-start gap-[20px] text-left cursor-pointer"
          onClick={goToMover}
        >
          <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
            <Image
              src={profileImageSrc}
              alt={`${review.moverName} 기사님 프로필`}
              fill
              unoptimized={typeof profileImageSrc === 'string'}
              className="object-cover object-[center_20%]"
              sizes="80px"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <div className="flex w-full flex-col items-start">
              <div className="flex min-w-0 items-center gap-[6px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center">
                  <IcDriverMark aria-hidden="true" />
                </span>
                <p className="flex min-w-0 items-center gap-[4px] text-2lg-bold text-black-300 group-hover:underline">
                  <span className="min-w-0 break-all">{review.moverName}</span>
                  <span className="shrink-0">기사님</span>
                </p>
              </div>
              {review.description ? (
                <p className="w-full truncate text-md-regular text-gray-500 group-hover:underline">
                  {review.description}
                </p>
              ) : null}
            </div>
            <ServiceTags
              serviceType={review.serviceType}
              isDesignated={review.isDesignated}
            />
          </div>
        </button>
        <div className="flex w-full items-center gap-[20px]">
          <MetaItem label="출발지" value={review.fromRegion} />
          <MetaDivider />
          <MetaItem label="도착지" value={review.toRegion} />
          <MetaDivider />
          <MetaItem label="이사일" value={moveDate} />
        </div>
        <div className="flex w-full flex-col gap-[12px]">
          <StarRating value={review.rating} readOnly size={20} />
          <p className="whitespace-pre-wrap text-2lg-medium text-black-400">
            {review.content}
          </p>
        </div>
        <div className="flex items-center justify-end gap-[6px] text-xs-regular text-gray-300">
          <span>작성일</span>
          <span>{writtenDate}</span>
        </div>
      </div>
    </article>
  );
}
