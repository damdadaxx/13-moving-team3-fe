'use client';

// 헤더 모바일 슬라이드 메뉴
import { useEffect, type Ref } from 'react';

import { cva } from 'class-variance-authority';
import Link from 'next/link';

import IcMenuClose from '@/assets/icons/ic_menu_close.svg';

import { getGuestSigninPath } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import {
  HEADER_PANEL_IDS,
  type HeaderMenuItem,
} from '@/components/ui/Header/types';

interface MobileMenuProps {
  menus: HeaderMenuItem[];
  isOpen: boolean;
  isGuest: boolean;
  onClose: () => void;
  ref?: Ref<HTMLDivElement>;
}

const mobileMenuLayer = cva('fixed inset-0 z-header-m desktop:hidden', {
  variants: {
    open: {
      true: '',
      false: 'pointer-events-none',
    },
  },
});

const mobileMenuDim = cva(
  'fixed inset-0 bg-black-500 transition-opacity duration-300 ease-in-out',
  {
    variants: {
      open: {
        true: 'opacity-50',
        false: 'opacity-0',
      },
    },
  },
);

const mobileMenuPanel = cva(
  'fixed top-0 right-0 h-full w-[220px] bg-gray-50 transition-transform duration-300 ease-in-out',
  {
    variants: {
      open: {
        true: 'translate-x-0',
        false: 'translate-x-full',
      },
    },
  },
);

const mobileMenuItem = cva(
  'flex h-[74px] w-full cursor-pointer items-center px-[24px] py-[20px] text-lg-medium text-black-500',
);

/**
 * 모바일 메뉴
 * @param menus - 메뉴 목록
 * @param isOpen - 메뉴 열림 여부
 * @param isGuest - 게스트 여부
 * @param onClose - 메뉴 닫기 핸들러
 * @param ref - 메뉴 참조
 * @returns 모바일 메뉴 컴포넌트
 */
export default function MobileMenu({
  menus,
  isOpen,
  isGuest,
  onClose,
  ref,
}: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  return (
    <div
      id={HEADER_PANEL_IDS.mobile}
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={mobileMenuLayer({ open: isOpen })}
    >
      <span className={mobileMenuDim({ open: isOpen })} />
      <div ref={ref} className={mobileMenuPanel({ open: isOpen })}>
        <button
          type="button"
          aria-label="모바일 메뉴 닫기"
          onClick={onClose}
          className={cn(
            'h-[54px] w-full cursor-pointer border-b-1 border-b-line-100 px-[16px] py-[15px]',
          )}
        >
          <IcMenuClose
            aria-hidden
            className={cn('ml-auto h-[24px] w-[24px]')}
          />
        </button>
        <nav>
          <ul className={cn('h-full w-full')}>
            {menus.map((item) => (
              <li key={item.menu} className={mobileMenuItem()}>
                <Link href={item.href} onClick={onClose}>
                  {item.menu}
                </Link>
              </li>
            ))}
            {isGuest ? (
              <li className={mobileMenuItem()}>
                <Link href={getGuestSigninPath()} onClick={onClose}>
                  로그인
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </div>
  );
}
