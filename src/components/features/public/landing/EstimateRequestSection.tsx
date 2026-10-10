// 이사 견적 요청 섹션 컴포넌트
'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcAlarm from '@/assets/icons/ic_alarm_dark.svg';
import IcMenu from '@/assets/icons/ic_menu_dark.svg';
import IcProfile from '@/assets/icons/ic_profile_dark.svg';
import ImgAvatarBeaver from '@/assets/images/img_avatar_beaver.png';
import ImgLogo from '@/assets/images/img_logo.svg';
import ImgBgMarkM from '@/assets/images/mover-detail/img_bg_mark_m.svg';

import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';

import { cn } from '@/utils/cn';

import EstimateStatusBadge from '@/components/features/common/Estimate/EstimateStatusBadge';
import LikeButton from '@/components/features/common/MoverDetail/LikeButton';
import MoverNickname from '@/components/features/common/MoverProfile/MoverNickname';
import MoverStatsRow from '@/components/features/common/MoverProfile/MoverStatsRow';
import ProfileImage from '@/components/ui/ProfileImage';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

/** 견적 상세 태블릿 화면 폭. 카드 칸에 맞춰 scale로 줄인다 */
const PAGE_WIDTH = 744;
const SAMPLE_MOVE_DATE = '2024-08-26T10:00:00';
const SAMPLE_PRICE = 180000;

function TabletEstimatePreview() {
  const t = useTranslations('Landing');
  const tPage = useTranslations('PageHeader');
  const tEstimate = useTranslations('Estimate');
  const tService = useTranslations('ServiceType');
  const tMover = useTranslations('MoverCard');
  const formatDate = useFormatDate();
  const formatPrice = useFormatPrice();
  const slotRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const update = () => {
      setScale(slot.clientWidth / PAGE_WIDTH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  const infoItems = [
    {
      label: tEstimate('requestedAt'),
      value: formatDate(SAMPLE_MOVE_DATE, 'korean'),
    },
    { label: tEstimate('service'), value: tService('OFFICE_MOVE') },
    {
      label: tEstimate('usageDate'),
      value: formatDate(SAMPLE_MOVE_DATE, 'usage'),
    },
    { label: tEstimate('departure'), value: t('requestCardFrom') },
    { label: tEstimate('arrival'), value: t('requestCardTo') },
  ];

  return (
    <div ref={slotRef} className="h-full w-full overflow-hidden bg-gray-50">
      <div
        className="pointer-events-none origin-top-left"
        style={{ width: PAGE_WIDTH, transform: `scale(${scale})` }}
      >
        <header className="flex h-[54px] items-center justify-between border-b border-line-100 bg-gray-50 px-[24px]">
          <ImgLogo aria-hidden className="h-[34px] w-[88px]" />
          <div className="flex items-center gap-[24px] text-black-400">
            <IcAlarm aria-hidden className="size-[24px]" />
            <IcProfile aria-hidden className="size-[24px]" />
            <IcMenu aria-hidden className="size-[24px]" />
          </div>
        </header>

        <div className="bg-gray-50 px-[72px]">
          <p className="flex h-[54px] items-center text-2lg-semibold text-black-500">
            {tPage('estimateDetail')}
          </p>
        </div>

        <section className="relative pb-[23px]">
          <div className="relative h-[157px] overflow-hidden bg-orange-400">
            <ImgBgMarkM
              aria-hidden
              className="absolute top-[20px] left-[-38px] h-auto w-[152px] rotate-[-26deg] opacity-20"
            />
            <ImgBgMarkM
              aria-hidden
              className="absolute top-[55px] right-[4%] h-auto w-[284px] opacity-20"
            />
          </div>
          <div className="absolute inset-0 px-[72px]">
            <ProfileImage
              imageUrl={ImgAvatarBeaver.src}
              alt=""
              className="absolute bottom-0 left-0 size-[100px] tablet:size-[100px] desktop:size-[100px]"
            />
          </div>
        </section>

        <div className="px-[72px]">
          <div className="mb-[12px] flex items-center gap-[8px]">
            <ServiceTypeTag
              variant="service"
              serviceType="SMALL_MOVE"
              size="md"
            />
            <ServiceTypeTag variant="designatedEstimate" size="md" />
          </div>

          <div className="mb-[20px] flex items-center justify-between gap-[12px] border-b border-line-100 pb-[20px]">
            <p className="text-2xl-semibold text-black-300">
              {t('compareCardComment')}
            </p>
            <EstimateStatusBadge status="PROPOSED" />
          </div>

          <div className="border-b border-line-100 pb-[20px]">
            <div className="mb-[8px] flex items-center justify-between">
              <MoverNickname
                nickname={tMover('nickname', {
                  nickname: t('compareCardMover'),
                })}
              />
              <LikeButton
                variant="count"
                readOnly
                moverId="landing-preview"
                likeCount={136}
              />
            </div>
            <MoverStatsRow
              averageRating={5}
              reviewCount={178}
              careerMonths={84}
              confirmedCount={334}
            />
          </div>

          <div className="flex items-center gap-[61px] border-b border-line-100 py-[32px] text-black-400">
            <p className="text-xl-semibold">{tEstimate('price')}</p>
            <p className="text-2xl-bold">{formatPrice(SAMPLE_PRICE)}</p>
          </div>

          <div className="border-b border-line-100 py-[32px]">
            <p className="mb-[16px] text-xl-semibold text-black-400">
              {tEstimate('info')}
            </p>
            <dl className="flex flex-col gap-[16px]">
              {infoItems.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-[23px]">
                  <dt className="w-[90px] shrink-0 text-lg-regular text-gray-300">
                    {label}
                  </dt>
                  <dd className="text-lg-semibold text-black-400">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EstimateRequestSection() {
  const t = useTranslations('Landing');

  return (
    <section
      className={cn(
        'mb-[16.5px]',
        'tablet:px-[32px] tablet:mb-[36px]',
        'desktop:mb-[61px]',
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          'aspect-[1125/1488]',
          'tablet:mx-auto tablet:max-w-[1402px] tablet:aspect-[679/835]',
          'desktop:aspect-[4206/2360]',
        )}
      >
        <p className="sr-only">{t('requestImageAlt')}</p>
        <div aria-hidden className="absolute inset-0 bg-gray-50">
          <div
            className={cn(
              'absolute inset-x-0 top-0 h-[58%] bg-orange-400',
              'tablet:inset-x-[2%] tablet:top-[2%] tablet:h-[54%] tablet:rounded-[28px]',
              'desktop:inset-x-[1.5%] desktop:top-[2%] desktop:h-[64%] desktop:rounded-[36px]',
            )}
          >
            <ImgBgMarkM
              aria-hidden
              className="absolute top-[8%] left-[-4%] h-auto w-[28%] rotate-[-18deg] opacity-30"
            />
            <ImgBgMarkM
              aria-hidden
              className="absolute top-[18%] right-[6%] h-auto w-[34%] opacity-25"
            />
          </div>

          <Image
            src={ImgAvatarBeaver}
            alt=""
            className={cn(
              'absolute top-[18%] right-[1%] z-[2] h-auto w-[30%]',
              'tablet:top-[16%] tablet:right-[2%] tablet:w-[26%]',
              'desktop:top-[28%] desktop:right-[7%] desktop:w-[16%]',
            )}
          />

          <div
            className={cn(
              'absolute top-[26%] left-[6%] z-[1] h-[64%] w-[72%] overflow-hidden rounded-[20px] bg-gray-50 shadow-[0_12px_32px_rgba(0,0,0,0.12)]',
              'tablet:top-[22%] tablet:left-[5%] tablet:h-[72%] tablet:w-[74%] tablet:rounded-[24px]',
              'desktop:top-[8%] desktop:left-[8%] desktop:h-[82%] desktop:w-[36%] desktop:rounded-[28px]',
            )}
          >
            <TabletEstimatePreview />
          </div>
        </div>
        <ScrollReveal
          delay={0.15}
          className={cn(
            'absolute top-[clamp(29px,5.072vw+10.739px,50px)] right-[clamp(32px,2.415vw+23.304px,42px)]',
            'tablet:top-[clamp(49px,7.752vw,58px)] tablet:right-[clamp(53px,9.432vw,63px)]',
            'desktop:top-[clamp(49px,11.625vw-70.045px,152px)] desktop:right-[clamp(53px,24.266vw-195.489px,268px)]',
          )}
        >
          <h2
            className={cn(
              // text-xl-bold
              'text-gray-50 text-right text-[clamp(20px,2.899vw+9.565px,32px)] font-bold leading-[calc(32/20)]',
              // text-3xl-bold
              'tablet:text-3xl-bold tablet:leading-[calc(42/32)]',
              'desktop:text-left',
            )}
          >
            {t('requestLine1')}
            <br /> {t('requestLine2')}
          </h2>
        </ScrollReveal>
      </div>
    </section>
  );
}
