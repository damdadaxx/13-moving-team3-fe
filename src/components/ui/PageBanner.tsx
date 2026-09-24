// [컴포넌트] 페이지 배너 컴포넌트
'use client';

import ImgBgMarkM from '@/assets/images/mover-detail/img_bg_mark_m.svg';

import { cn } from '@/utils/cn';

export default function PageBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn('relative w-full overflow-hidden bg-orange-400', className)}
    >
      <div
        className={cn(
          'relative w-full max-w-[1500px] mx-auto h-[122px]',
          'tablet:h-[157px]',
          'desktop:h-[180px]',
        )}
      >
        <ImgBgMarkM
          aria-hidden
          className={cn(
            'absolute h-auto opacity-20 rotate-[-26deg]',
            'top-[21.7px] left-[-26px] w-[84px]',
            'tablet:top-[20px] tablet:left-[-38px] tablet:w-[152px]',
            'desktop:top-[34px] desktop:left-0 desktop:w-[152px]',
          )}
        />
        <ImgBgMarkM
          aria-hidden
          className={cn(
            'absolute h-auto opacity-20',
            'top-[50px] right-[4.8%] w-[156px]',
            'tablet:top-[55px] tablet:right-[3.76%] tablet:w-[284px]',
            'desktop:top-[70px] desktop:right-[14.42%]',
          )}
        />
      </div>
    </section>
  );
}
