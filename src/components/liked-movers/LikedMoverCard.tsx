'use client';

import type { ServiceType } from '@/types/serviceType';
import Image from 'next/image';
import Link from 'next/link';

import IcDriver from '@/assets/icons/ic_driver.svg';
import IcDriverMark from '@/assets/icons/ic_driver_mark.svg';
import IcLike from '@/assets/icons/ic_like.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgMoverCharacter from '@/assets/images/img_mover_character.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Checkbox from '@/components/ui/Checkbox';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

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
  // 반응형에 맞는 태그 사이즈
  const tagSize = useBreakpointValue('sm', 'md', 'md');
  const profileImageSrc = mover.imgUrl ? mover.imgUrl : ImgMoverCharacter;

  return (
    <article
      className={cn(
        'flex flex-col gap-[12px] rounded-[16px] border-[0.5px] border-line-100 bg-gray-50 px-[14px] py-[16px] ',
        'shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]',
        'tablet:rounded-[20px] tablet:px-[24px] tablet:py-[20px]',
        'desktop:px-[28px] desktop:py-[24px]',
      )}
    >
      <div className="flex min-h-[34px] items-center justify-between gap-[8px]">
        <div className="flex flex-wrap items-center gap-[4px]">
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
          label={`${mover.name} 기사님 선택`}
          className="[&>span:last-child]:sr-only"
        />
      </div>

      {/* 카드 클릭시 기사 상세 페이지로 이동 */}
      <Link
        href={`/mover/${mover.moverId}`}
        className="flex gap-[12px] desktop:gap-[20px]"
      >
        <div
          className={cn(
            'relative shrink-0 overflow-hidden rounded-[12px] bg-black-300',
            'size-[46px]',
            'tablet:size-[80px]',
            'desktop:size-[134px]',
          )}
        >
          <Image
            src={profileImageSrc}
            alt="기사 프로필 이미지"
            fill
            unoptimized={typeof profileImageSrc === 'string'}
            className="object-cover object-[center_20%]"
            sizes="(min-width: 1024px) 134px, (min-width: 744px) 80px, 46px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[12px] py-[4px] desktop:gap-[20px]">
          <div className="flex min-w-0 flex-col">
            <p className="text-md-semibold text-black-300 desktop:text-xl-semibold">
              {mover.title}
            </p>
            <p className="truncate text-xs-regular text-gray-500 desktop:text-md-regular">
              {mover.description}
            </p>
          </div>

          <div className="flex items-end justify-between gap-[8px]">
            <div className="flex min-w-0 flex-col gap-[4px]">
              <div className="flex items-center gap-[4px]">
                <span className="relative flex h-[23px] w-[20px] shrink-0 items-center justify-center">
                  <IcDriver
                    aria-hidden="true"
                    className="h-[18.2px] w-[16px]"
                  />
                  <IcDriverMark
                    aria-hidden="true"
                    className="absolute top-[calc(50%-0.5px)] left-1/2 h-[7.2px] w-[12.8px] -translate-x-1/2 -translate-y-1/2"
                  />
                </span>
                <p className="text-md-semibold text-black-300 desktop:text-lg-semibold">
                  {mover.name}
                  <span> 기사님</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-[8px]">
                <div className="flex items-center gap-[2px]">
                  <IcStar aria-hidden="true" className="size-[20px]" />
                  <p className="text-sm-medium text-black-300">
                    {mover.rating.toFixed(1)}
                    <span className="text-gray-300">
                      {`(${mover.reviewCount})`}
                    </span>
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="h-[14px] w-px bg-line-200"
                />
                <p className="text-sm-medium">
                  <span className="text-gray-300">경력 </span>
                  <span className="text-black-300">{mover.careerYears}년</span>
                </p>
                <span
                  aria-hidden="true"
                  className="h-[14px] w-px bg-line-200"
                />
                <p className="text-sm-medium">
                  <span className="text-black-300">
                    {mover.confirmedCount}건
                  </span>
                  <span className="text-gray-300"> 확정</span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center gap-[2px]">
              <IcLike aria-hidden="true" className="size-[24px] text-red-200" />
              <span className="text-md-regular text-gray-500">
                {mover.likeCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
