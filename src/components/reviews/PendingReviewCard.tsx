'use client';

import type { PendingReview } from '@/types/review';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IcDriver from '@/assets/icons/ic_driver.svg';
import IcDriverMark from '@/assets/icons/ic_driver_mark.svg';
import ImgMoverCharacter from '@/assets/images/img_mover_character.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import Button from '@/components/ui/Button/Button';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

interface PendingReviewCardProps {
  review: PendingReview;
  onWrite?: (review: PendingReview) => void;
}

function formatWon(price: number) {
  return `${price.toLocaleString('ko-KR')}원`;
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
    <span
      aria-hidden="true"
      className="hidden h-[50px] w-px shrink-0 bg-line-200 tablet:block"
    />
  );
}

export default function PendingReviewCard({
  review,
  onWrite,
}: PendingReviewCardProps) {
  const tagSize = useBreakpointValue('sm', 'sm', 'md');
  const profileImageSrc = review.imgUrl ?? ImgMoverCharacter;
  const router = useRouter();

  const tags = (
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
  );

  const driverName = (
    <div className="flex items-center gap-[6px]">
      <span className="relative flex h-[23px] w-[20px] shrink-0 items-center justify-center">
        <IcDriver aria-hidden="true" className="h-[18.2px] w-[16px]" />
        <IcDriverMark
          aria-hidden="true"
          className="absolute top-[calc(50%-0.5px)] left-1/2 h-[7.2px] w-[12.8px] -translate-x-1/2 -translate-y-1/2"
        />
      </span>
      <p className="text-lg-semibold text-black-300 tablet:text-2lg-bold">
        {review.moverName}
        <span> 기사님</span>
      </p>
    </div>
  );

  const description = (
    <p className="truncate text-xs-regular text-gray-500 tablet:text-md-regular">
      {review.description}
    </p>
  );

  const amount = (
    <div className="flex w-full items-end justify-between tablet:w-auto tablet:shrink-0 tablet:flex-col tablet:items-end desktop:w-[160px]">
      <span className="text-md-medium text-gray-300 tablet:text-md-regular tablet:text-gray-500 desktop:text-lg-medium">
        견적 금액
      </span>
      <span className="text-2lg-bold text-black-400 tablet:text-2lg-bold tablet:text-black-500 desktop:text-2xl-bold desktop:text-black-400">
        {formatWon(review.price)}
      </span>
    </div>
  );

  return (
    <article
      className={cn(
        'flex w-full flex-col rounded-[20px] border-[0.5px] border-line-100 bg-gray-50',
        'shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)] cursor-pointer',
        'gap-[20px] px-[20px] py-[24px]',
        'tablet:gap-[24px] tablet:p-[32px]',
        'desktop:gap-[24px] desktop:px-[40px] desktop:py-[32px]',
      )}
      onClick={(e) => {
        //클릭한게 버튼이라면 상세페이지로 이동하는 함수는 무시하고 넘어가기.
        const button = (e.target as HTMLElement).closest('button');
        if (button) {
          return;
        }
        router.push(`/mover/${review.moverId}`);
      }}
    >
      <div className="flex flex-col gap-[12px] tablet:flex-row tablet:items-end tablet:gap-[20px] desktop:gap-[24px]">
        <div className="tablet:hidden">{tags}</div>

        <div className="flex items-center gap-[8px] tablet:min-w-0 tablet:flex-1 tablet:items-end tablet:gap-[20px] desktop:gap-[24px]">
          <div
            className={cn(
              'relative order-2 shrink-0 overflow-hidden rounded-[12px] bg-black-300',
              'size-[64px]',
              'tablet:order-1 tablet:size-[80px]',
              'desktop:size-[100px]',
            )}
          >
            <Image
              src={profileImageSrc}
              alt="기사님 프로필 이미지"
              fill
              unoptimized={typeof profileImageSrc === 'string'}
              className="object-cover object-[center_20%]"
              sizes="(min-width: 1024px) 100px, (min-width: 744px) 80px, 64px"
            />
          </div>

          <div className="order-1 flex min-w-0 flex-1 flex-col gap-[4px] tablet:order-2 tablet:gap-[8px]">
            <div className="flex min-w-0 flex-col">
              {driverName}
              {description}
            </div>
            <div className="hidden tablet:block">{tags}</div>
          </div>
        </div>

        <div className="hidden desktop:block">{amount}</div>
      </div>

      <div className="flex flex-col gap-[16px] desktop:flex-row desktop:items-start desktop:justify-between desktop:gap-[20px]">
        <div className="flex w-full items-center gap-[16px] desktop:w-auto desktop:gap-[20px]">
          <MetaItem label="출발지" value={review.fromRegion} />
          <MetaDivider />
          <MetaItem label="도착지" value={review.toRegion} />
          <MetaDivider />
          <MetaItem
            label="이사일"
            value={formatDate(review.moveDate, 'korean')}
          />
          <div className="ml-auto hidden tablet:block desktop:hidden">
            {amount}
          </div>
        </div>

        <div className="flex border-t border-line-200 pt-[16px] tablet:hidden">
          {amount}
        </div>

        <div className="w-full tablet:mt-[24px] desktop:mt-0 desktop:w-[160px]">
          <Button
            variant="solid"
            size="sm"
            onClick={() => {
              onWrite?.(review);
            }}
          >
            리뷰 작성하기
          </Button>
        </div>
      </div>
    </article>
  );
}
