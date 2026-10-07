'use client';

import { useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import type { CompletedReview } from '@/types/review';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcDriverMark from '@/assets/icons/ic_driver.png';

import { useFormatDate } from '@/hooks/common/useFormatDate';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import NoImage from '@/components/ui/NoImage';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';
import StarRating from '@/components/ui/StarRating';

interface CompletedReviewCardProps {
  review: CompletedReview;
}

function formatWrittenDate(date: string) {
  const formatted = formatDate(date, 'review');
  return formatted.replaceAll('-', '. ');
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

function CompletedReviewProfile({
  imgUrl,
  alt,
  className,
  sizes,
}: {
  imgUrl: string | null;
  alt: string;
  className: string;
  sizes: string;
}) {
  const imageUrl = resolveImageUrl(imgUrl);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = imageUrl !== null && failedUrl !== imageUrl;

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[12px]',
        className,
      )}
    >
      {showPhoto ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized // TODO: 업로드 호스트가 remotePatterns 추가 시 삭제
          className="object-cover"
          sizes={sizes}
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <NoImage alt={alt} />
      )}
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
  const t = useTranslations('CustomerReviews');
  const tCard = useTranslations('MoverCard');
  const tEstimate = useTranslations('Estimate');
  const formatDateLocale = useFormatDate();
  const router = useRouter();
  const moveDate = formatDateLocale(review.moveDate, 'korean');
  /* 모바일은 좁아서 끝의 요일 "(월)"을 뺀다 */
  const moveDateMobile = moveDate.replace(/\s*\([^)]*\)\s*$/, '');
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
                <Image
                  src={IcDriverMark}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                />
              </span>
              <p className="flex min-w-0 items-center gap-[4px] text-lg-semibold text-black-300 group-hover:underline">
                <span className="min-w-0 break-all">
                  {tCard('nickname', { nickname: review.moverName })}
                </span>
              </p>
            </div>
            <CompletedReviewProfile
              imgUrl={review.imgUrl}
              alt={tCard('profileAlt', { nickname: review.moverName })}
              className="size-[50px]"
              sizes="50px"
            />
          </button>
        </div>
        <div className="h-px w-full bg-line-100" />
        <div className="flex min-w-0 items-center gap-[16px]">
          <MobileMetaItem
            label={tEstimate('departure')}
            value={review.fromRegion}
          />
          <MobileMetaItem
            label={tEstimate('arrival')}
            value={review.toRegion}
          />
          <MobileMetaItem
            label={tEstimate('moveDate')}
            value={moveDateMobile}
          />
        </div>
        <div className="h-px w-full bg-line-100" />
        <div className="flex w-full flex-col gap-[12px]">
          <StarRating value={review.rating} readOnly size={20} />
          <p className="whitespace-pre-wrap text-lg-medium text-black-400">
            {review.content}
          </p>
        </div>
        <div className="flex items-center justify-end gap-[6px] text-xs-regular text-gray-300">
          <span>{t('writtenAt')}</span>
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
          <CompletedReviewProfile
            imgUrl={review.imgUrl}
            alt={tCard('profileAlt', { nickname: review.moverName })}
            className="size-[80px]"
            sizes="80px"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <div className="flex w-full flex-col items-start">
              <div className="flex min-w-0 items-center gap-[6px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center">
                  <Image
                    src={IcDriverMark}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                  />
                </span>
                <p className="flex min-w-0 items-center gap-[4px] text-2lg-bold text-black-300 group-hover:underline">
                  <span className="min-w-0 break-all">
                    {tCard('nickname', { nickname: review.moverName })}
                  </span>
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
          <MetaItem label={tEstimate('departure')} value={review.fromRegion} />
          <MetaDivider />
          <MetaItem label={tEstimate('arrival')} value={review.toRegion} />
          <MetaDivider />
          <MetaItem label={tEstimate('moveDate')} value={moveDate} />
        </div>
        <div className="flex w-full flex-col gap-[12px]">
          <StarRating value={review.rating} readOnly size={20} />
          <p className="whitespace-pre-wrap text-2lg-medium text-black-400">
            {review.content}
          </p>
        </div>
        <div className="flex items-center justify-end gap-[6px] text-xs-regular text-gray-300">
          <span>{t('writtenAt')}</span>
          <span>{writtenDate}</span>
        </div>
      </div>
    </article>
  );
}
