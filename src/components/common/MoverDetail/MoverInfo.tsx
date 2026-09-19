'use client';

import IcMoverBadge from '@/assets/icons/ic_mover_badge.svg';

import { cn } from '@/utils/cn';

import MoverReviewInfo from '@/components/common/MoverDetail/MoverReviewInfo';
import ServiceRegionList from '@/components/common/MoverDetail/ServiceRegionList';
import ServiceTypeList from '@/components/common/MoverDetail/ServiceTypeList';
import ServiceTypeTagList from '@/components/common/MoverDetail/ServiceTypeTagList';
import ShareButtonGroup from '@/components/common/MoverDetail/ShareButtonGroup';

export default function MoverInfo({ className }: { className?: string }) {
  return (
    <section className={cn(className)}>
      {/* 기사님 이름, 경력 정보 */}
      <div className={cn('mt-[13px]', 'tablet:mt-[23px]', 'desktop:mt-[31px]')}>
        {/* 서비스 타입 태그 */}
        <ServiceTypeTagList />

        <div>
          <h1
            className={cn(
              'mb-[16px] text-2lg-semibold text-black-300',
              'tablet:mb-[20px] tablet:text-2xl-semibold',
            )}
          >
            고객님의 물품을 안전하게 운송해 드립니다.
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
              김코드 기사님
            </p>
          </div>

          {/* 찜하기 */}
          <ShareButtonGroup likeCount={136} />
        </div>

        <p
          className={cn(
            'mb-[32px] text-md-regular text-gray-500',
            'tablet:mb-[32px] tablet:text-lg-regular',
          )}
        >
          안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는
          김코드입니다. 고객님의 물품을 소중하고 안전하게 운송하여 드립니다.
          소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과
          경기권입니다.
        </p>

        <div
          className={cn(
            'flex flex-col gap-[32px] pb-[32px] mb-[32px] border-b border-line-100',
            'desktop:gap-[40px]',
          )}
        >
          {/* 리뷰/경력 정보 */}
          <MoverReviewInfo />

          {/* 제공 서비스 */}
          <ServiceTypeList />

          {/* 서비스 가능 지역 */}
          <ServiceRegionList />
        </div>
      </div>
    </section>
  );
}
