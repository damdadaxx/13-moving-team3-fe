// 이사 유형 선택 섹션 컴포넌트
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ImgMoveTypeBox from '@/assets/images/landing/img_move_type_box.png';
import ImgMoveTypeBuilding from '@/assets/images/landing/img_move_type_building.png';
import ImgMoveTypeTruck from '@/assets/images/landing/img_move_type_truck.png';

import { cn } from '@/utils/cn';

import ScrollReveal from '@/components/ui/ScrollReveal';

const MOVE_TYPE_CARDS = [
  {
    serviceType: 'SMALL_MOVE' as const,
    image: ImgMoveTypeBox,
    descKey: 'moveTypeSmallDesc' as const,
    highlighted: false,
  },
  {
    serviceType: 'HOME_MOVE' as const,
    image: ImgMoveTypeTruck,
    descKey: 'moveTypeHomeDesc' as const,
    highlighted: true,
  },
  {
    serviceType: 'OFFICE_MOVE' as const,
    image: ImgMoveTypeBuilding,
    descKey: 'moveTypeOfficeDesc' as const,
    highlighted: false,
  },
];

export default function MoveTypeSection() {
  const t = useTranslations('Landing');
  const tServiceType = useTranslations('ServiceType');

  return (
    <section
      className={cn(
        'py-[32px_61px]',
        'tablet:py-[69px_108px]',
        'desktop:py-[115px_124px]',
      )}
    >
      <div
        className={cn(
          'max-w-[1402px] mx-auto',
          'tablet:flex tablet:flex-col tablet:gap-[40px]',
          'desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-0',
        )}
      >
        <ScrollReveal delay={0.15} className="desktop:shrink-0">
          <h2
            className={cn(
              'ml-[32px] mb-[32px] text-xl-bold text-black-400',
              'tablet:m-0 tablet:ml-[32px] tablet:pr-[25px] tablet:font-bold',
              'tablet:text-[32px] tablet:leading-[calc(46/32)]',
              'desktop:ml-0',
              'desktop:text-[clamp(24px,1.667vw,32px)]',
              'desktop:pl-[clamp(84px,8.229vw,158px)]',
            )}
          >
            {t('moveTypeLine1')} <br />
            {t('moveTypeLine2')}
          </h2>
        </ScrollReveal>
        {/* 모바일: 가운데 카드만 온전히 보이고, 양옆 카드는 화면 양끝에서 잘린다 */}
        <div className="flex justify-center overflow-hidden tablet:hidden">
          <ul className="flex w-max shrink-0 items-center gap-[4px]">
            {MOVE_TYPE_CARDS.map(
              ({ serviceType, image, descKey, highlighted }) => (
                <li
                  key={serviceType}
                  className={cn(
                    'flex shrink-0 flex-col items-center justify-center text-center',
                    highlighted
                      ? 'h-[168px] w-[156px] gap-[6px] rounded-[24px] border-2 border-orange-300 bg-gray-50 px-[12px]'
                      : 'h-[132px] w-[128px] gap-[4px] rounded-[20px] bg-background-200 px-[10px]',
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    aria-hidden
                    className={cn(
                      'h-auto',
                      highlighted ? 'w-[96px]' : 'w-[64px]',
                    )}
                  />
                  <div className="flex max-w-full flex-col items-center gap-[2px]">
                    <span
                      className={cn(
                        'max-w-full font-bold whitespace-nowrap',
                        highlighted
                          ? 'text-[15px] leading-[20px] text-orange-400'
                          : 'text-[13px] leading-[18px] text-black-500',
                      )}
                    >
                      {tServiceType(serviceType)}
                    </span>
                    <span
                      className={cn(
                        'max-w-full text-gray-500',
                        highlighted
                          ? 'text-[11px] leading-[15px]'
                          : 'text-[10px] leading-[14px]',
                      )}
                    >
                      {t(descKey)}
                    </span>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* 태블릿·데스크톱: Figma 데스크톱 스펙(node 9507:42610) 그대로 */}
        <ul
          className={cn(
            'hidden min-w-0',
            'tablet:flex tablet:w-full tablet:items-center tablet:justify-center tablet:gap-[16px]',
            'desktop:flex-1 desktop:justify-end desktop:gap-[clamp(12px,1.25vw,24px)] desktop:pr-[clamp(24px,4.375vw,84px)]',
          )}
        >
          {MOVE_TYPE_CARDS.map(
            ({ serviceType, image, descKey, highlighted }) => (
              <li
                key={serviceType}
                className={cn(
                  '@container flex min-w-0 flex-col items-center justify-center gap-[8px] text-center',
                  highlighted
                    ? 'w-full max-w-[245px] flex-[245_1_0] rounded-[clamp(20px,16cqw,40px)] border-[clamp(2px,1.6cqw,4px)] border-orange-300 bg-gray-50 px-[clamp(12px,9cqw,22px)] py-[clamp(12px,9.4cqw,23px)] shadow-[0px_1px_2px_rgba(12,12,13,0.1),0px_1px_2px_rgba(12,12,13,0.05)]'
                    : 'w-full max-w-[200px] flex-[200_1_0] rounded-[clamp(16px,16cqw,32px)] bg-background-200 px-[clamp(12px,13cqw,26px)] pt-[clamp(12px,13cqw,26px)] pb-[clamp(14px,15cqw,30px)]',
                )}
              >
                <Image
                  src={image}
                  alt=""
                  aria-hidden
                  className={
                    highlighted
                      ? 'h-auto w-[156px] max-w-full'
                      : 'h-auto w-[100px] max-w-full'
                  }
                />
                <div className="flex w-full flex-col items-center gap-[3px]">
                  <span
                    className={cn(
                      'font-bold',
                      highlighted
                        ? 'text-[clamp(13px,8.2cqw,20px)] text-orange-400'
                        : 'text-[clamp(12px,8cqw,16px)] text-black-500',
                    )}
                  >
                    {tServiceType(serviceType)}
                  </span>
                  <span
                    className={cn(
                      'whitespace-nowrap text-gray-500',
                      highlighted
                        ? 'text-[clamp(10px,5.3cqw,13px)]'
                        : 'text-[clamp(9px,5.5cqw,11px)]',
                    )}
                  >
                    {t(descKey)}
                  </span>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
