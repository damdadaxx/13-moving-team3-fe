// 업체 견적 비교 섹션 컴포넌트
import Image from 'next/image';

import ImgBuilding from '@/assets/images/landing/img_building.svg';
import ImgCard from '@/assets/images/landing/img_card.png';

import { cn } from '@/utils/cn';

interface EstimateCardProps {
  className?: string;
}

function EstimateCard({ className }: EstimateCardProps) {
  return (
    <Image
      src={ImgCard}
      alt=""
      className={cn('h-auto w-full', className)}
      sizes="(min-width: 1024px) 21vw, (min-width: 744px) 45vw, 100vw"
    />
  );
}

export default function CompareEstimatesSection() {
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

        <h2
          className={cn(
            'relative z-10 px-[32px] pt-[56px] text-xl-bold text-black-400',
            'tablet:absolute tablet:left-[4.3%] tablet:top-[5.59%] tablet:px-0 tablet:pt-0 tablet:text-3xl-bold',
            'desktop:left-[21.51%] desktop:top-[11.1%] desktop:text-[clamp(24px,1.667vw,32px)]',
          )}
        >
          여러 업체의 견적을 <br /> 한눈에 비교하고 선택해요
        </h2>

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
              'tablet:absolute tablet:left-[51.1%] tablet:top-[38.63%] tablet:z-[1] tablet:w-[44.59%]',
              'desktop:left-[66.81%] desktop:top-[27.27%] desktop:w-[20.33%] desktop:gap-[0.9vw]',
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
