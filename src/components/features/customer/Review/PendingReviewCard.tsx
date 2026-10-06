'use client';

import { useRouter } from '@/i18n/navigation';
import type { PendingReview } from '@/types/review';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcDriverMark from '@/assets/icons/ic_driver.png';
import ImgMoverCharacter from '@/assets/images/img_profile_example.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface PendingReviewCardProps {
  review: PendingReview;
  onWrite?: (review: PendingReview) => void;
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-md-regular text-gray-500">{label}</span>
      <span className="text-md-regular whitespace-nowrap text-black-500 tablet:text-lg-regular">
        {value}
      </span>
    </div>
  );
}

function MetaDivider() {
  return (
    <span aria-hidden="true" className="h-[50px] w-px shrink-0 bg-line-100" />
  );
}

export default function PendingReviewCard({
  review,
  onWrite,
}: PendingReviewCardProps) {
  const tagSize = useBreakpointValue('sm', 'sm', 'md');
  const profileImageSrc = review.imgUrl ?? ImgMoverCharacter;
  const router = useRouter();
  const t = useTranslations('CustomerReviews');
  const tCard = useTranslations('MoverCard');
  const tEstimate = useTranslations('Estimate');
  const formatDateLocale = useFormatDate();
  const formatPrice = useFormatPrice();
  const moveDate = formatDateLocale(review.moveDate, 'korean');
  const priceLabel = formatPrice(review.price);

  return (
    <article
      className={cn(
        'flex min-w-0 w-full flex-col overflow-hidden rounded-[20px] border-[0.5px] border-line-100 bg-gray-50',
        'shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]',
        'px-[20px] py-[24px]',
        'tablet:p-[32px]',
        'desktop:px-[40px] desktop:py-[32px]',
      )}
    >
      {/* 모바일 */}
      <div className="flex min-w-0 flex-col gap-[20px] tablet:hidden">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-wrap items-center gap-[8px]">
            <ServiceTypeTag
              variant="service"
              serviceType={review.serviceType}
              size={tagSize}
            />
            {review.isDesignated ? (
              <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
            ) : null}
          </div>
          <div
            className="group flex min-w-0 cursor-pointer items-start gap-[8px]"
            onClick={(event) => {
              const button = (event.target as HTMLElement).closest('button');
              if (button) return;
              router.push(`/mover/${review.moverId}`);
            }}
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 w-full flex-col items-start gap-[4px] tablet:flex-row tablet:items-start tablet:gap-[6px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center tablet:mt-[4px]">
                  <Image
                    src={IcDriverMark}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                  />
                </span>
                <p className="min-w-0 w-full break-all text-lg-semibold text-black-300 group-hover:underline tablet:w-auto tablet:flex-1 tablet:text-2lg-bold">
                  {tCard('nickname', { nickname: review.moverName })}
                </p>
              </div>
              <p className="truncate text-xs-regular text-gray-500 group-hover:underline tablet:text-md-regular">
                {review.description}
              </p>
            </div>
            <div className="relative size-[64px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
              <Image
                src={profileImageSrc}
                alt={tCard('profileAlt', { nickname: review.moverName })}
                fill
                unoptimized={typeof profileImageSrc === 'string'}
                className="object-cover object-[center_20%]"
                sizes="64px"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-[12px] flex w-full items-center gap-[16px]">
              <MetaItem
                label={tEstimate('departure')}
                value={review.fromRegion}
              />
              <MetaItem label={tEstimate('arrival')} value={review.toRegion} />
            </div>
            <MetaItem label={tEstimate('moveDate')} value={moveDate} />
          </div>
          <div className="flex border-t border-line-200 py-[20px] tablet:hidden">
            <div className="flex w-full items-end justify-between">
              <span className="text-md-medium text-gray-300">
                {tEstimate('priceAmount')}
              </span>
              <span className="text-2lg-bold text-black-400">{priceLabel}</span>
            </div>
          </div>
        </div>
        <Button
          variant="solid"
          size="sm"
          onClick={() => {
            onWrite?.(review);
          }}
        >
          {t('write')}
        </Button>
      </div>

      {/* 태블릿 */}
      <div className="hidden min-w-0 flex-col gap-[40px] tablet:max-desktop:flex">
        <div className="flex flex-col gap-[24px] ">
          <div
            className="group flex min-w-0 cursor-pointer items-start gap-[20px]"
            onClick={(event) => {
              const button = (event.target as HTMLElement).closest('button');
              if (button) return;
              router.push(`/mover/${review.moverId}`);
            }}
          >
            <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
              <Image
                src={profileImageSrc}
                alt={tCard('profileAlt', { nickname: review.moverName })}
                fill
                unoptimized={typeof profileImageSrc === 'string'}
                className="object-cover object-[center_20%]"
                sizes="80px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 w-full flex-col items-start gap-[4px] tablet:flex-row tablet:items-start tablet:gap-[6px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center tablet:mt-[4px]">
                  <Image
                    src={IcDriverMark}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                  />
                </span>
                <p className="min-w-0 w-full break-all text-lg-semibold text-black-300 group-hover:underline tablet:w-auto tablet:flex-1 tablet:text-2lg-bold">
                  {tCard('nickname', { nickname: review.moverName })}
                </p>
              </div>
              <p className="truncate text-xs-regular text-gray-500 group-hover:underline tablet:text-md-regular  tablet:mb-[8px]">
                {review.description}
              </p>
              <div className="flex flex-wrap items-center gap-[8px]">
                <ServiceTypeTag
                  variant="service"
                  serviceType={review.serviceType}
                  size={tagSize}
                />
                {review.isDesignated ? (
                  <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[16px]">
            <MetaItem
              label={tEstimate('departure')}
              value={review.fromRegion}
            />
            <MetaItem label={tEstimate('arrival')} value={review.toRegion} />
            <MetaDivider />
            <MetaItem label={tEstimate('moveDate')} value={moveDate} />
            <MetaDivider />
            <div className="ml-auto flex flex-col items-end">
              <span className="text-md-regular text-gray-500">
                {tEstimate('priceAmount')}
              </span>
              <span className="text-2lg-bold whitespace-nowrap text-black-500">
                {priceLabel}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="solid"
          size="sm"
          onClick={() => {
            onWrite?.(review);
          }}
        >
          {t('write')}
        </Button>
      </div>

      {/* 데스크탑  */}
      <div className="hidden min-w-0 w-full flex-col gap-[24px] desktop:flex">
        <div className="flex min-h-[100px] w-full min-w-0 items-start gap-[24px]">
          <div
            className="group flex min-w-0 flex-1 cursor-pointer items-start gap-[24px]"
            onClick={(event) => {
              const button = (event.target as HTMLElement).closest('button');
              if (button) return;
              router.push(`/mover/${review.moverId}`);
            }}
          >
            <div className="relative size-[100px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
              <Image
                src={profileImageSrc}
                alt={tCard('profileAlt', { nickname: review.moverName })}
                fill
                unoptimized={typeof profileImageSrc === 'string'}
                className="object-cover object-[center_20%]"
                sizes="100px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 w-full flex-col items-start gap-[4px] tablet:flex-row tablet:items-start tablet:gap-[6px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center tablet:mt-[4px]">
                  <Image
                    src={IcDriverMark}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                  />
                </span>
                <p className="min-w-0 w-full break-all text-lg-semibold text-black-300 group-hover:underline tablet:w-auto tablet:flex-1 tablet:text-2lg-bold">
                  {tCard('nickname', { nickname: review.moverName })}
                </p>
              </div>
              <p className="truncate text-xs-regular text-gray-500 group-hover:underline tablet:text-md-regular  tablet:mb-[8px]">
                {review.description}
              </p>
              <div className="flex flex-wrap items-center gap-[8px]">
                <ServiceTypeTag
                  variant="service"
                  serviceType={review.serviceType}
                  size={tagSize}
                />
                {review.isDesignated ? (
                  <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex w-[160px] shrink-0 flex-col items-end">
            <div className="flex h-[32px] w-full items-center justify-end">
              <span className="text-lg-medium w-full text-right text-gray-500">
                {tEstimate('priceAmount')}
              </span>
            </div>
            <span className="text-2xl-bold w-full text-right text-black-400">
              {priceLabel}
            </span>
          </div>
        </div>
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-[20px]">
            <MetaItem
              label={tEstimate('departure')}
              value={review.fromRegion}
            />
            <MetaDivider />
            <MetaItem label={tEstimate('arrival')} value={review.toRegion} />
            <MetaDivider />
            <MetaItem label={tEstimate('moveDate')} value={moveDate} />
          </div>
          <div className="h-[54px] w-[160px] shrink-0">
            <Button
              variant="solid"
              size="sm"
              onClick={() => {
                onWrite?.(review);
              }}
            >
              {t('write')}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
