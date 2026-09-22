'use client';

import type { MoverListItem } from '@/types/mover';

import IcMoverBadge from '@/assets/icons/ic_mover_badge.svg';

import { cn } from '@/utils/cn';

import MoverReviewInfo from '@/components/common/MoverDetail/MoverReviewInfo';
import ServiceRegionList from '@/components/common/MoverDetail/ServiceRegionList';
import ServiceTypeList from '@/components/common/MoverDetail/ServiceTypeList';
import ServiceTypeTagList from '@/components/common/MoverDetail/ServiceTypeTagList';
import ShareButtonGroup from '@/components/common/MoverDetail/ShareButtonGroup';

interface MoverInfoProps {
  className?: string;
  mover: MoverListItem;
}

export default function MoverInfo({ className, mover }: MoverInfoProps) {
  return (
    <section className={cn(className)}>
      {/* 기사님 이름, 경력 정보 */}
      <div className={cn('mt-[13px]', 'tablet:mt-[23px]', 'desktop:mt-[31px]')}>
        {/* 서비스 타입 태그 */}
        <ServiceTypeTagList serviceTypes={mover.serviceTypes} />

        <div>
          <h1
            className={cn(
              'mb-[16px] text-2lg-semibold text-black-300',
              'tablet:mb-[20px] tablet:text-2xl-semibold',
            )}
          >
            {mover.shortIntro}
          </h1>
        </div>

        <div
          className={cn(
            'flex justify-between items-center gap-[4px] mb-[16px]',
            'tablet:mb-[20px]',
          )}
        >
          <div className={cn('flex items-center gap-[4px]')}>
            <IcMoverBadge className="h-[20px] w-[23px]" />
            <p
              className={cn(
                'text-lg-semibold text-black-300',
                'tablet:text-2lg-semibold',
              )}
            >
              {mover.nickname}
            </p>
          </div>

          {/* 찜하기 */}
          <ShareButtonGroup moverId={mover.id} likeCount={mover.likeCount} />
        </div>

        <div
          className={cn(
            'flex flex-col gap-[32px] pb-[32px] mb-[32px] border-b border-line-100',
            'desktop:gap-[40px]',
          )}
        >
          {/* 리뷰/경력 정보 */}
          <MoverReviewInfo
            confirmedCount={mover.confirmedCount}
            averageRating={mover.averageRating}
            reviewCount={mover.reviewCount}
            careerMonths={mover.careerMonths}
          />

          {/* 제공 서비스 */}
          <ServiceTypeList serviceTypes={mover.serviceTypes} />

          {/* 서비스 가능 지역 */}
          <ServiceRegionList serviceRegions={mover.serviceRegions} />
        </div>
      </div>
    </section>
  );
}
