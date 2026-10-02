'use client';

// 히어로 섹션 컴포넌트
import Image from 'next/image';

import ImgCar from '@/assets/images/landing/img_car.svg';
import ImgCarMobile from '@/assets/images/landing/img_car_m.svg';
import ImgHeroBg from '@/assets/images/landing/img_hero_bg.jpg';
import ImgHeroBgDesktop from '@/assets/images/landing/img_hero_bg_desktop.jpg';
import ImgHeroBgTablet from '@/assets/images/landing/img_hero_bg_tablet.jpg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

export default function Hero() {
  /*
  @ 히어로 배경 이미지
  - 마운트 전에는 mobile 이미지를 보여주고, 마운트 후 실제 브레이크포인트 이미지로 바꾼다.
  */
  //  TODO: 마운트 전 모바일 이미지 보여주는 이슈 수정
  const heroImage = useBreakpointValue(
    ImgHeroBg,
    ImgHeroBgTablet,
    ImgHeroBgDesktop,
  );

  return (
    <section>
      <div className="relative">
        {/* 히어로 배경 이미지 */}
        <div
          className={cn(
            'relative z-20 flex h-[313px] w-full items-center justify-center overflow-hidden',
            'tablet:h-[405px]',
          )}
        >
          <Image
            className={cn('h-full w-full object-cover object-center')}
            src={heroImage}
            alt=""
            sizes="100vw"
            priority
          />
        </div>

        {/* 히어로 콘텐츠 */}
        <div
          className={cn(
            'absolute inset-0 z-30 flex flex-col items-center justify-center px-[24px] text-center mb-[16px]',
            'tablet:mb-[20px]',
          )}
        >
          <ImgCarMobile
            aria-hidden
            className={cn('h-[63px] w-[100px] desktop:hidden')}
          />
          <ImgCar
            aria-hidden
            className={cn('hidden h-[100px] w-[160px] desktop:block')}
          />
          <h1
            className={cn(
              'mb-[8px] text-xl-bold text-gray-50',
              'tablet:text-3xl-bold',
            )}
          >
            이사업체, 어떻게 고르세요?
          </h1>
          <p
            className={cn(
              'text-lg-regular text-gray-200',
              'tablet:text-2lg-regular',
            )}
          >
            무빙은 여러 견적을 한눈에 비교해 <br /> 이사업체 선정 과정을
            간편하게 바꿔드려요
          </p>
        </div>
      </div>
    </section>
  );
}
