// 업체 견적 비교 섹션 컴포넌트
'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import ImgBuilding from '@/assets/images/landing/img_building.svg';

import { useFormatPrice } from '@/hooks/common/useFormatPrice';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import MoverSummary from '@/components/features/customer/Estimate/MoverSummary';
import Button from '@/components/ui/Button/Button';
import EstimateCardFrame from '@/components/ui/EstimateCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface EstimateCardProps {
  className?: string;
}

/** 시안 카드 폭. 칸이 이보다 좁거나 넓으면 scale로 칸 너비에 맞춘다 */
const CARD_WIDTH = 390;
const SAMPLE_MOVE_DATE = '2024-07-01T12:00:00';
const SAMPLE_PRICE = 180000;

function EstimateCard({ className }: EstimateCardProps) {
  const t = useTranslations('Landing');
  const tEstimate = useTranslations('Estimate');
  const tConfirm = useTranslations('EstimateConfirm');
  const formatPrice = useFormatPrice();
  const slotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    const card = cardRef.current;
    if (!slot || !card) return;

    const update = () => {
      const nextScale = slot.clientWidth / CARD_WIDTH;
      setScale(nextScale);
      slot.style.height = `${card.offsetHeight * nextScale}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(slot);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={slotRef} className={cn('relative w-full', className)}>
      {/* 칸 비율은 섹션이 잡고, 카드 내용은 시안 폭으로 그린 뒤 칸에 맞춰 줄어든다 */}
      <div
        ref={cardRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CARD_WIDTH, transform: `scale(${scale})` }}
      >
        <EstimateCardFrame
          className={cn(
            'pointer-events-none gap-[12px] px-[17px] py-[18px]',
            'tablet:px-[22px] tablet:py-[18px]',
            // 1920 카드는 390×312. EstimateCard의 desktop 패딩이 덮으면 두 번째 카드가 아래로 밀린다
            'desktop:gap-[12px] desktop:px-[25px] desktop:py-[20px]',
          )}
        >
          <div className="flex w-full flex-col gap-[10px]">
            <div className="flex items-center gap-[8px]">
              <ServiceTypeTag
                variant="service"
                serviceType="SMALL_MOVE"
                size="sm"
              />
              <ServiceTypeTag variant="designatedEstimate" size="sm" />
            </div>

            <p className="text-md-semibold text-black-300">
              {t('compareCardComment')}
            </p>

            <div className="[&>div]:pt-[4px]! [&>div]:pb-[8px]!">
              <MoverSummary
                name={t('compareCardMover')}
                imgUrl={null}
                likeCount={136}
                averageRating={5}
                reviewCount={178}
                careerMonths={84}
                confirmedCount={334}
              />
            </div>

            <div className="flex items-start justify-between gap-[4px]">
              <div className="flex min-w-0 items-end gap-[6px]">
                <div className="flex flex-col">
                  <span className="text-xs-regular text-gray-500">
                    {tEstimate('departure')}
                  </span>
                  <span className="text-sm-semibold whitespace-nowrap text-black-500">
                    {t('compareCardFrom')}
                  </span>
                </div>
                <IcArrowRight
                  aria-hidden
                  className="mb-[2px] h-[16px] w-[12px] shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-xs-regular text-gray-500">
                    {tEstimate('arrival')}
                  </span>
                  <span className="text-sm-semibold whitespace-nowrap text-black-500">
                    {t('compareCardTo')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs-regular text-gray-500">
                  {tEstimate('moveDate')}
                </span>
                <span className="text-sm-semibold whitespace-nowrap text-black-500">
                  {formatDate(SAMPLE_MOVE_DATE, 'korean')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line-200 pt-[8px]">
              <span className="text-sm-medium text-black-400">
                {tEstimate('priceAmount')}
              </span>
              <span className="text-lg-bold text-black-400">
                {formatPrice(SAMPLE_PRICE)}
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-[8px]">
            <Button
              type="button"
              variant="outlined"
              tabIndex={-1}
              className="pointer-events-none h-[34px]"
            >
              {tEstimate('viewDetail')}
            </Button>
            <Button
              type="button"
              tabIndex={-1}
              className="pointer-events-none h-[34px]"
            >
              {tConfirm('button')}
            </Button>
          </div>
        </EstimateCardFrame>
      </div>
    </div>
  );
}

export default function CompareEstimatesSection() {
  const t = useTranslations('Landing');

  return (
    <section className={cn('relative overflow-hidden')}>
      <div
        className={cn(
          'relative mx-auto w-full',
          'tablet:aspect-[744/1008] tablet:h-auto',
          'desktop:aspect-[1920/1081] desktop:max-w-[1920px]',
        )}
      >
        <div
          className={cn(
            'hidden bg-orange-100',
            'tablet:absolute tablet:inset-x-0 tablet:bottom-0 tablet:block tablet:h-[69.25%]',
            'desktop:h-[59.76%]',
          )}
        />

        <ScrollReveal
          delay={0.15}
          className={cn(
            'relative z-10 px-[32px] pt-[56px]',
            'tablet:absolute tablet:left-[4.3%] tablet:top-[5.59%] tablet:px-0 tablet:pt-0',
            'desktop:left-[21.51%] desktop:top-[11.1%]',
          )}
        >
          <h2
            className={cn(
              'text-xl-bold text-black-400',
              'tablet:text-3xl-bold',
              'desktop:text-[clamp(24px,1.667vw,32px)]',
            )}
          >
            {t('compareLine1')} <br /> {t('compareLine2')}
          </h2>
        </ScrollReveal>

        <div
          className={cn(
            'relative z-[1] mt-[106px] flex flex-col gap-[15px] bg-orange-100 px-[32px] pb-[58px] pt-[36px]',
            'tablet:absolute tablet:inset-0 tablet:mt-0 tablet:bg-transparent tablet:p-0',
          )}
        >
          <ImgBuilding
            aria-hidden
            className={cn(
              'absolute right-[-38px] bottom-[calc(100%-2px)] z-[2] h-auto w-[224px]',
              'tablet:left-[56.01%] tablet:right-auto tablet:top-[20.54%] tablet:bottom-auto tablet:w-[34.08%]',
              'desktop:left-[21.51%] desktop:top-[28.15%] desktop:w-[16.51%]',
            )}
          />

          <div
            className={cn(
              'flex flex-col gap-[15px]',
              'tablet:absolute tablet:left-[4.3%] tablet:top-[21.03%] tablet:z-[1] tablet:w-[44.59%]',
              'desktop:left-[45.47%] desktop:top-[7.96%] desktop:w-[20.33%] desktop:gap-[0.9vw]',
            )}
          >
            <EstimateCard />
            <EstimateCard />
          </div>

          <div
            className={cn(
              'flex flex-col gap-[15px]',
              // 태블릿 하단 여백: (1008 - 937.06) / 1008 = 7.04%
              'tablet:absolute tablet:left-[51.1%] tablet:top-[38.63%] tablet:bottom-[7.04%] tablet:z-[1] tablet:w-[44.59%]',
              'desktop:bottom-auto desktop:left-[66.81%] desktop:top-[27.27%] desktop:w-[20.33%] desktop:gap-[0.9vw]',
            )}
          >
            <EstimateCard />
            <EstimateCard className={cn('hidden tablet:block')} />
          </div>
        </div>
      </div>
    </section>
  );
}
