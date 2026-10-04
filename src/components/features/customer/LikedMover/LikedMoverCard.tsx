'use client';

import { Link } from '@/i18n/navigation';
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcDriverMark from '@/assets/icons/ic_driver.png';
import IcLike from '@/assets/icons/ic_like.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgMoverCharacter from '@/assets/images/img_profile_example.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Checkbox from '@/components/ui/Checkbox';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

export interface LikedMover {
  moverId: string;
  serviceTypes: ServiceType[];
  title: string;
  description: string;
  name: string;
  imgUrl: string | null;
  rating: number;
  reviewCount: number;
  careerYears: number;
  confirmedCount: number;
  likeCount: number;
}

interface LikedMoverCardProps {
  mover: LikedMover;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export default function LikedMoverCard({
  mover,
  isSelected,
  onSelectChange,
}: LikedMoverCardProps) {
  const t = useTranslations('LikedMovers');
  const tCard = useTranslations('MoverCard');
  const tCommon = useTranslations('Common');
  // 반응형에 맞는 태그 사이즈
  const tagSize = useBreakpointValue('sm', 'md', 'md');
  const profileImageSrc = mover.imgUrl ? mover.imgUrl : ImgMoverCharacter;

  const profile = (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[12px] bg-black-300',
        'size-[50px]',
        'tablet:size-[134px]',
      )}
    >
      <Image
        src={profileImageSrc}
        alt={tCard('profileAlt', { nickname: mover.name })}
        fill
        unoptimized={typeof profileImageSrc === 'string'}
        className="object-cover object-[center_20%]"
        sizes="(min-width: 744px) 134px, 50px"
      />
    </div>
  );

  const driverName = (
    <div className="flex items-center gap-[4px]">
      <span className="relative flex h-[23px] w-[20px] shrink-0 items-center justify-center">
        <Image
          src={IcDriverMark}
          alt=""
          aria-hidden
          className="h-[23px] w-[20px]"
        />
      </span>
      <p className="text-md-semibold text-black-300 tablet:text-lg-semibold">
        {tCard('nickname', { nickname: mover.name })}
      </p>
    </div>
  );

  const statDivider = (
    <span aria-hidden="true" className="h-[14px] w-px shrink-0 bg-line-200" />
  );

  const rating = (
    <div className="flex items-center gap-[2px]">
      <div className="flex items-center justify-center size-[20px]">
        <IcStar aria-hidden="true" className="size-[14px]" />
      </div>
      <p className="whitespace-nowrap text-sm-medium text-black-300">
        {mover.rating.toFixed(1)}
        <span className="text-gray-300">{`(${mover.reviewCount})`}</span>
      </p>
    </div>
  );

  const career = (
    <p className="whitespace-nowrap text-sm-medium">
      <span className="text-gray-300">{tCard('career')} </span>
      <span className="text-black-300">
        {tCommon('careerYears', { count: mover.careerYears })}
      </span>
    </p>
  );

  const confirmed = (
    <p className="whitespace-nowrap text-sm-medium">
      <span className="text-black-300">
        {tCard('confirmedCount', { count: mover.confirmedCount })}
      </span>
      <span className="text-gray-300"> {tCard('confirmed')}</span>
    </p>
  );

  const stats = (
    <div className="flex flex-wrap items-center gap-[6px] tablet:gap-[8px]">
      {rating}
      {statDivider}
      {career}
      {statDivider}
      {confirmed}
    </div>
  );

  const likeCount = (
    <div className="flex shrink-0 items-center justify-center gap-[2px]">
      <IcLike aria-hidden="true" className="size-[24px] text-red-200" />
      <span className="text-md-regular text-gray-500">{mover.likeCount}</span>
    </div>
  );

  return (
    <article
      className={cn(
        'flex flex-col gap-[8px] rounded-[16px] border-[0.5px] border-line-100 bg-gray-50 p-[20px]',
        'shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]',
        'tablet:gap-[13px] tablet:rounded-[20px] tablet:px-[28px] tablet:py-[24px]',
        'desktop:px-[28px] desktop:py-[24px]',
      )}
    >
      <div className="flex min-h-[34px] items-center justify-between gap-[8px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          {mover.serviceTypes.map((serviceType) => (
            <ServiceTypeTag
              key={serviceType}
              variant="service"
              serviceType={serviceType}
              size={tagSize}
            />
          ))}
        </div>
        {/*label이 필수 값이라 sr-only로 숨긴다. */}
        <Checkbox
          checked={isSelected}
          onChange={onSelectChange}
          label={t('selectMover', { nickname: mover.name })}
          className="[&>span:last-child]:sr-only"
        />
      </div>

      {/* 카드 클릭시 기사 상세 페이지로 이동 */}
      <Link
        href={`/mover/${mover.moverId}`}
        className="flex flex-col gap-[16px] tablet:flex-row tablet:items-start tablet:gap-[20px]"
      >
        <div className="hidden shrink-0 tablet:block">{profile}</div>

        <div className="flex min-w-0 flex-1 flex-col gap-[16px] tablet:gap-[20px] tablet:self-stretch tablet:py-[4px]">
          <div className="flex min-w-0 flex-col">
            <p className="text-md-semibold text-black-300 tablet:text-xl-semibold">
              {mover.title}
            </p>
            <p className="line-clamp-2 min-w-0 w-full overflow-hidden break-words text-xs-regular text-gray-500 tablet:text-md-regular">
              {mover.description}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="h-px w-full bg-line-100 tablet:hidden"
          />

          <div className="flex w-full items-center gap-[8px] tablet:hidden">
            {profile}
            <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <div className="flex items-center justify-between gap-[8px]">
                {driverName}
                {likeCount}
              </div>
              <div className="flex items-center gap-[6px]">
                {rating}
                {statDivider}
                {career}
                {statDivider}
                {confirmed}
              </div>
            </div>
          </div>

          <div className="hidden w-full items-end justify-between tablet:flex">
            <div className="flex min-w-0 flex-col gap-[4px]">
              {driverName}
              {stats}
            </div>
            {likeCount}
          </div>
        </div>
      </Link>
    </article>
  );
}
