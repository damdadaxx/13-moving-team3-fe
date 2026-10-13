// 맨 위로 이동 버튼
'use client';

import { useTranslations } from 'next-intl';

import IcChevronUp from '@/assets/icons/ic_chevron_up.svg';

import { useShowTopButton } from '@/hooks/common/useShowTopButton';

import { cn } from '@/utils/cn';

interface TopButtonProps {
  className?: string;
}

/*
@ TopButton
- 200px 이상 스크롤하면 우하단에 보이고, 클릭하면 페이지 맨 위로 이동한다
- 크기는 채팅 플로팅 버튼과 같다 (48px, 데스크톱 56px)
- 숨겨져 있을 때는 자리를 비워서 채팅 버튼이 이 위치에 온다
- 레이아웃에서 한 번만 렌더한다
*/
export default function TopButton({ className }: TopButtonProps) {
  const t = useTranslations('Common');
  const isVisible = useShowTopButton();

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('scrollToTop')}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={cn(
        'fixed right-[16px] bottom-[24px] z-top-button flex size-[48px] cursor-pointer items-center justify-center rounded-full border border-line-200 bg-gray-50 text-black-400',
        'shadow-[2px_2px_10px_0px_rgba(46,46,46,0.08)]',
        'transition-[opacity,transform] duration-300 ease-out',
        'tablet:right-[24px] tablet:bottom-[32px]',
        'desktop:right-[40px] desktop:bottom-[40px] desktop:size-[56px]',
        isVisible
          ? 'opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      <IcChevronUp aria-hidden className="size-[24px]" />
    </button>
  );
}
