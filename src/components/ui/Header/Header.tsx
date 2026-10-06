'use client';

// 공용 헤더 컴포넌트
import { useCallback, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import type { AuthVariant } from '@/types/role';
import { type Messages, useTranslations } from 'next-intl';

import ImgLogo from '@/assets/images/img_logo.svg';
import ImgLogoMobile from '@/assets/images/img_logo_m.svg';

import { ROUTES, isProtectedPath } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useUnreadCountQuery } from '@/hooks/features/notification/queries/queries';
import useNotificationStream from '@/hooks/features/notification/useNotificationStream';

import { cn } from '@/utils/cn';
import { getAuthVariant } from '@/utils/getAuthVariant';

import DesktopMenu from '@/components/ui/Header/DesktopMenu';
import HeaderActions from '@/components/ui/Header/HeaderActions';
import MobileMenu from '@/components/ui/Header/MobileMenu';
import type { HeaderMenuItem, HeaderPanel } from '@/components/ui/Header/types';

interface HeaderProps {
  hasSessionCookie?: boolean;
}

/*
@ 역할별 GNB 메뉴
- 메뉴 이름은 번역 키(messages > Header.nav)로 두고, 컴포넌트에서 현재 언어로 바꾼다
*/
type HeaderNavKey = keyof Messages['Header']['nav'];

const MENU_DATA: Record<
  AuthVariant,
  (Omit<HeaderMenuItem, 'menu'> & { menuKey: HeaderNavKey })[]
> = {
  guest: [{ menuKey: 'findMover', href: ROUTES.moverList }],
  customer: [
    { menuKey: 'requestEstimate', href: ROUTES.customerHome },
    { menuKey: 'findMover', href: ROUTES.moverList },
    {
      menuKey: 'myEstimates',
      href: ROUTES.customerEstimatesPending,
      activePrefix: ROUTES.customerEstimatesRoot,
    },
  ],
  mover: [
    { menuKey: 'receivedRequests', href: ROUTES.moverHome },
    {
      menuKey: 'myEstimates',
      href: ROUTES.moverEstimates,
      activePrefix: ROUTES.moverEstimatesRoot,
    },
  ],
};

export default function Header({ hasSessionCookie = false }: HeaderProps) {
  const [openPanel, setOpenPanel] = useState<HeaderPanel | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const isMobileMenuOpen = openPanel === 'mobile';
  const isProfileMenuOpen = openPanel === 'profile';
  const isNotificationMenuOpen = openPanel === 'notification';

  const { user, role, isLoggedIn, isLoading, logout } = useAuth();
  const { data: unread } = useUnreadCountQuery(isLoggedIn);
  useNotificationStream(isLoggedIn);
  const unreadCount = unread?.unreadCount ?? 0;
  const pathname = usePathname();
  const headerVariant = getAuthVariant(role);
  const isGuest = !isLoading && !isLoggedIn;
  const t = useTranslations('Header');
  const menus: HeaderMenuItem[] = isLoading
    ? []
    : MENU_DATA[headerVariant].map(({ menuKey, ...item }) => ({
        ...item,
        menu: t(`nav.${menuKey}`),
      }));
  /*
  @ 로그인 스켈레톤 힌트
  - httpOnly accessToken은 클라이언트에서 못 읽는다
  - 서버가 내려준 쿠키 존재 여부로 공개 페이지(/, /mover)에서도 아이콘 스켈레톤을 보여준다
  - 보호 경로는 세션이 있다고 보고 아이콘 스켈레톤을 유지한다
  */
  const isLoggedInHint =
    Boolean(user?.name) || hasSessionCookie || isProtectedPath(pathname);
  const isDesktop = useBreakpointValue(false, false, true);

  /** 데스크탑이면 모바일 메뉴 상태를 렌더 중에 닫기*/
  if (isDesktop && openPanel === 'mobile') {
    setOpenPanel(null);
  }

  /** 바깥 클릭·ESC·링크 이동 후 패널 닫기 */
  const closePanel = useCallback(() => {
    setOpenPanel(null);
  }, []);

  /** 패널 토글
   * - 해당 패널만 토글, 다른 패널은 같이 닫힘 */
  const togglePanel = useCallback((panel: HeaderPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }, []);

  /**
   * 패널 참조 설정
   * - 프로필 메뉴: profileMenuRef
   * - 알림 메뉴: notificationMenuRef
   * - 모바일 메뉴: mobileMenuRef
   * - 패널이 열리면 해당 참조를 사용하여 바깥 클릭·ESC 닫기 처리 */
  const openPanelRef =
    openPanel === 'profile'
      ? profileMenuRef
      : openPanel === 'notification'
        ? notificationMenuRef
        : mobileMenuRef;

  useOutsideClick(openPanelRef, closePanel, {
    enabled: openPanel !== null,
    closeOnEscape: true,
  });

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-header flex items-center h-[54px] px-[24px] bg-gray-50 border-b-1 border-b-line-100',
        'desktop:h-[88px]',
      )}
    >
      <div
        className={cn(
          'flex justify-between w-full h-full',
          'desktop:max-w-[1600px] desktop:mx-auto',
        )}
      >
        <div
          className={cn('flex items-center gap-[24px]', 'desktop:gap-[80px]')}
        >
          {/* 로고 */}
          <Link href="/" aria-label={t('home')}>
            <ImgLogoMobile
              aria-hidden
              className={cn('h-[32px] w-[32px] tablet:hidden')}
            />
            <ImgLogo
              aria-hidden
              className={cn(
                'hidden tablet:block',
                'tablet:h-[34px] tablet:w-[88px]',
                'desktop:h-[44px] desktop:w-[116px]',
              )}
            />
          </Link>

          {/* PC 메뉴 */}
          <DesktopMenu menus={menus} />
        </div>

        {/* 우측 액션 */}
        <HeaderActions
          isLoading={isLoading}
          user={user}
          isLoggedInHint={isLoggedInHint}
          unreadCount={unreadCount}
          isNotificationOpen={isNotificationMenuOpen}
          isProfileOpen={isProfileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          notificationMenuRef={notificationMenuRef}
          profileMenuRef={profileMenuRef}
          onTogglePanel={togglePanel}
          onClosePanel={closePanel}
          onLogout={logout}
        />
      </div>

      {/* 모바일 메뉴 목록 */}
      <MobileMenu
        ref={mobileMenuRef}
        menus={menus}
        isOpen={isMobileMenuOpen}
        isGuest={isGuest}
        onClose={closePanel}
      />
    </header>
  );
}
