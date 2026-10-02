// 이사 유형 선택 섹션 컴포넌트
import Image from 'next/image';

import ImgHowToChoose from '@/assets/images/landing/img_how_to_choose.jpg';
import ImgHowToChooseMobile from '@/assets/images/landing/img_how_to_choose_m.jpg';

import { cn } from '@/utils/cn';

export default function MoveTypeSection() {
  return (
    <section
      className={cn(
        'py-[32px_61px]',
        'tablet:py-[69px_108px] tablet:px-[32px]',
        'desktop:flex desktop:items-center desktop:justify-center desktop:items-center desktop:gap-[108px] desktop:py-[115px_124px]',
      )}
    >
      <h2
        className={cn(
          'ml-[32px] mb-[32px] text-xl-bold text-black-400',
          'tablet:ml-0 tablet:mb-[40px] tablet:text-3xl-bold',
          'desktop:m-0 desktop:pl-[108px] desktop:text-[clamp(24px,1.667vw,32px)]',
        )}
      >
        번거로운 선정과정, <br />
        이사 유형부터 선택해요
      </h2>
      {/* TODO: 이미지 밀림 현상 수정 */}
      <div>
        <Image
          src={ImgHowToChooseMobile}
          alt=""
          aria-hidden
          className={cn('block h-auto w-full tablet:hidden')}
        />
        <Image
          src={ImgHowToChoose}
          alt=""
          aria-hidden
          className={cn(
            'hidden h-auto w-full tablet:block',
            'tablet:mx-auto',
            'desktop:max-w-[693px] desktop:pr-[84px]',
          )}
        />
      </div>
    </section>
  );
}
