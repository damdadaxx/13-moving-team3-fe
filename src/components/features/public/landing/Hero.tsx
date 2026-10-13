'use client';

// 히어로 섹션 컴포넌트
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ImgCar from '@/assets/images/landing/img_car.svg';
import ImgCarMobile from '@/assets/images/landing/img_car_m.svg';
import ImgHeroBg from '@/assets/images/landing/img_hero_bg.jpg';
import ImgHeroBgDesktop from '@/assets/images/landing/img_hero_bg_desktop.jpg';
import ImgHeroBgTablet from '@/assets/images/landing/img_hero_bg_tablet.jpg';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Hero() {
  const t = useTranslations('Landing');
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const heroImage = useBreakpointValue(
    ImgHeroBg,
    ImgHeroBgTablet,
    ImgHeroBgDesktop,
  );
  const { ready, isIntroActive } = useIntroGate();
  /*
  @ 모바일 인트로가 재생될 때만 섹션이 아래에서 올라온다
  - opacity로 숨기면 배경 JPEG가 투명한 동안 디코드되고, 다시 보여도 빈 채로 남는 경우가 있다
  */
  const [introSlide, setIntroSlide] = useState(false);
  if (isIntroActive && !introSlide) {
    setIntroSlide(true);
  }

  return (
    <section
      className={cn(
        introSlide &&
          'transition-transform delay-150 duration-[550ms] ease-out',
        introSlide && !ready && 'translate-y-[40px]',
      )}
    >
      <div className="relative">
        {/*
          히어로 배경 이미지
          - 숨긴 이미지까지 fill + sizes 100vw로 두면 너비 0으로 측정되어
            Next 개발 오버레이가 뜬다. 현재 브레이크포인트 파일만 렌더한다.
        */}
        <div
          className={cn(
            'relative z-20 h-[313px] w-full overflow-hidden',
            'tablet:h-[405px]',
          )}
        >
          <Image
            fill
            priority
            className="object-cover object-center"
            src={heroImage}
            alt=""
            sizes="100vw"
          />
        </div>

        {/* 히어로 콘텐츠 */}
        <div
          className={cn(
            'absolute inset-0 z-30 flex flex-col items-center justify-center px-[24px] text-center mb-[16px]',
            'tablet:mb-[20px]',
          )}
        >
          <ScrollReveal delay={0.15}>
            <ImgCarMobile
              aria-hidden
              className={cn('h-[63px] w-[100px] desktop:hidden')}
            />
            <ImgCar
              aria-hidden
              className={cn('hidden h-[100px] w-[160px] desktop:block')}
            />
          </ScrollReveal>
          <div className={cn('flex flex-col items-center justify-center')}>
            <ScrollReveal delay={0.2}>
              <h1
                className={cn(
                  'mb-[8px] text-xl-bold text-gray-50',
                  'tablet:text-3xl-bold',
                )}
              >
                {t('heroTitle')}
              </h1>
              <p
                className={cn(
                  'text-lg-regular text-gray-200',
                  'tablet:text-2lg-regular',
                )}
              >
                {t('heroDescLine1')} <br /> {t('heroDescLine2')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <Button
                className="w-[190px] mt-[24px]"
                size={buttonSize}
                href={'/mover'}
              >
                기사님 찾으러 가기
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
