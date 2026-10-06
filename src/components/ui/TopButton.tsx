// 맨 위로 이동 버튼
'use client';

import { useSyncExternalStore } from 'react';

import { useTranslations } from 'next-intl';

import IcChevronUp from '@/assets/icons/ic_chevron_up.svg';

import { cn } from '@/utils/cn';

const SCROLL_SHOW_OFFSET = 200;

function subscribe(onStoreChange: () => void) {
  window.addEventListener('scroll', onStoreChange, { passive: true });
  return () => window.removeEventListener('scroll', onStoreChange);
}

function getScrollSnapshot() {
  return window.scrollY > SCROLL_SHOW_OFFSET;
}

function getServerScrollSnapshot() {
  return false;
}

interface TopButtonProps {
  className?: string;
}

/*
@ TopButton
- 200px 이상 스크롤하면 우하단에 보이고, 클릭하면 페이지 맨 위로 이동한다
- 레이아웃에서 한 번만 렌더한다
*/
export default function TopButton({ className }: TopButtonProps) {
  const t = useTranslations('Common');
  const isVisible = useSyncExternalStore(
    subscribe,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('scrollToTop')}
      className={cn(
        'fixed right-[16px] bottom-[24px] z-top-button flex size-[40px] cursor-pointer items-center justify-center rounded-full border border-line-200 bg-gray-50 text-black-400',
        'shadow-[2px_2px_10px_0px_rgba(46,46,46,0.08)]',
        'tablet:right-[24px] tablet:bottom-[32px]',
        'desktop:right-[40px] desktop:bottom-[40px] desktop:size-[48px]',
        className,
      )}
    >
      <IcChevronUp aria-hidden className="size-[24px]" />
    </button>
  );
}
