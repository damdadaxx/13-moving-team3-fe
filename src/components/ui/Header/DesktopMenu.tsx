'use client';

// 헤더 Desktop 메뉴
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import type { HeaderMenuItem } from '@/components/ui/Header/types';

interface DesktopMenuProps {
  menus: HeaderMenuItem[];
}

const headerMenuItem = cva(
  'text-2lg-bold transition-colors duration-300 hover:text-black-500',
  {
    variants: {
      tone: {
        default: 'text-black-500',
        active: 'text-black-500',
        inactive: 'text-gray-400',
      },
    },
  },
);

/**
 * 메뉴 활성 접두사 조회
 * @param item - 메뉴 아이템
 * @returns 메뉴 활성 접두사
 */
function getActivePrefix(item: HeaderMenuItem) {
  return item.activePrefix ?? item.href;
}

/**
 * 인증 경로 조회
 * @param pathname - 현재 경로
 * @returns 인증 경로 여부
 */
function isAuthPath(pathname: string) {
  return pathname.endsWith('/signin') || pathname.endsWith('/signup');
}

/**
 * 메뉴 활성 여부 조회
 * @param pathname - 현재 경로
 * @param item - 메뉴 아이템
 * @param menus - 메뉴 목록
 * @returns 메뉴 활성 여부
 */
function isMenuActive(
  pathname: string,
  item: HeaderMenuItem,
  menus: HeaderMenuItem[],
) {
  if (isAuthPath(pathname) && item.href === ROUTES.moverList) {
    return true;
  }

  const matchedPrefix = menus
    .map(getActivePrefix)
    .filter(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
    .sort((a, b) => b.length - a.length)[0];

  return matchedPrefix === getActivePrefix(item);
}

/**
 * 메뉴 톤 조회
 * @param isActive - 메뉴 활성 여부
 * @param hasActiveMenu - 활성 메뉴 여부
 * @returns 메뉴 톤
 */
function getMenuTone(isActive: boolean, hasActiveMenu: boolean) {
  if (!hasActiveMenu) {
    return 'default';
  }
  return isActive ? 'active' : 'inactive';
}

/**
 * Desktop 메뉴
 * @param menus - 메뉴 목록
 * @returns Desktop 메뉴 컴포넌트
 */
export default function DesktopMenu({ menus }: DesktopMenuProps) {
  const pathname = usePathname();
  const hasActiveMenu = menus.some((item) =>
    isMenuActive(pathname, item, menus),
  );

  return (
    <nav className={cn('hidden', 'desktop:block')}>
      <ul className={cn('flex items-center gap-[32px]')}>
        {menus.map((item) => {
          const isActive = isMenuActive(pathname, item, menus);

          return (
            <li
              key={item.menu}
              className={headerMenuItem({
                tone: getMenuTone(isActive, hasActiveMenu),
              })}
            >
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.menu}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
