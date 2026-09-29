// 푸터 컴포넌트
import ImgLogo from '@/assets/images/landing/img_footer_logo.svg';
import ImgLogoMobile from '@/assets/images/landing/img_footer_logo_m.svg';

import { cn } from '@/utils/cn';

export default function Footer() {
  return (
    <footer
      className={cn(
        'flex flex-col items-center justify-center gap-[12px] py-[40px] bg-[linear-gradient(90deg,_#F95D2E_3.36%,_#F9502E_88.38%)]',
        'tablet:gap-[32px] tablet:py-[65px]',
        'desktop:py-[87px]',
      )}
    >
      <div
        className={cn('w-[56px] h-[56px]', 'tablet:w-[100px] tablet:h-[100px]')}
      >
        <ImgLogoMobile aria-hidden className={cn('block desktop:hidden')} />
        <ImgLogo aria-hidden className={cn('hidden desktop:block')} />
      </div>
      <p
        className={cn(
          'text-lg-bold text-gray-50',
          'tablet:text-[28px] tablet:leading-[calc(28/46)] tablet:font-bold',
        )}
      >
        복잡한 이사 준비, 무빙 하나면 끝!
      </p>
    </footer>
  );
}
