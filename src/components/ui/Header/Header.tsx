'use client';

// 공용 헤더 컴포넌트
import { useCallback, useRef, useState } from 'react';

import type { AuthVariant } from '@/types/role';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ImgLogo from '@/assets/images/img_logo.svg';
import ImgLogoMobile from '@/assets/images/img_logo_m.svg';

import { ROUTES, isProtectedPath } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';
import { getAuthVariant } from '@/utils/getAuthVariant';

import DesktopMenu from '@/components/ui/Header/DesktopMenu';
import HeaderActions from '@/components/ui/Header/HeaderActions';
import MobileMenu from '@/components/ui/Header/MobileMenu';
import NotificationDropdown, {
  DUMMY_UNREAD_COUNT,
} from '@/components/ui/Header/NotificationDropdown';
import ProfileDropdown from '@/components/ui/Header/ProfileDropdown';
import type { HeaderMenuItem, HeaderPanel } from '@/components/ui/Header/types';

interface HeaderProps {
  hasSessionCookie?: boolean;
}

const MENU_DATA: Record<AuthVariant, HeaderMenuItem[]> = {
  guest: [{ menu: '기사님 찾기', href: ROUTES.moverList }],
  customer: [
    { menu: '견적 요청', href: ROUTES.customerHome },
    { menu: '기사님 찾기', href: ROUTES.moverList },
    {
      menu: '내 견적 관리',
      href: ROUTES.customerEstimates,
      activePrefix: ROUTES.customerEstimatesRoot,
    },
  ],
  mover: [
    { menu: '받은 요청', href: ROUTES.moverHome },
    {
      menu: '내 견적 관리',
      href: ROUTES.moverEstimates,
      activePrefix: ROUTES.moverEstimatesRoot,
    },
  ],
};

export default function Header({ hasSessionCookie = false }: HeaderProps) {
  const [openPanel, setOpenPanel] = useState<HeaderPanel | null>(null);
  const [unreadCount, setUnreadCount] = useState(DUMMY_UNREAD_COUNT);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const isMobileMenuOpen = openPanel === 'mobile';
  const isProfileMenuOpen = openPanel === 'profile';
  const isNotificationMenuOpen = openPanel === 'notification';

  const { user, role, isLoggedIn, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const headerVariant = getAuthVariant(role);
  const isGuest = !isLoading && !isLoggedIn;
  const menus = isLoading ? [] : MENU_DATA[headerVariant];
  /*
  @ 로그인 스켈레톤 힌트
  - httpOnly accessToken은 클라이언트에서 못 읽는다
  - 서버가 내려준 쿠키 존재 여부로 공개 페이지(/, /mover)에서도 아이콘 스켈레톤을 보여준다
  - 보호 경로는 세션이 있다고 보고 아이콘 스켈레톤을 유지한다
  */
  const isLoggedInHint =
    Boolean(user?.name) || hasSessionCookie || isProtectedPath(pathname);
  const isDesktop = useBreakpointValue({
    mobile: false,
    tablet: false,
    desktop: true,
  });

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
        'fixed inset-x-0 top-0 z-header flex items-center h-[54px] px-[24px] py-[10px] bg-gray-50 border-b-1 border-b-line-100',
        'tablet:px-[72px]',
        'desktop:py-[26px] desktop:h-[88px]',
      )}
    >
      <div
        className={cn(
          'flex justify-between w-full',
          'desktop:max-w-[1600px] desktop:mx-auto',
        )}
      >
        <div
          className={cn('flex items-center gap-[24px]', 'desktop:gap-[80px]')}
        >
          {/* 로고 */}
          <Link href="/" aria-label="무빙 홈">
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
          userName={user?.name ?? null}
          isLoggedInHint={isLoggedInHint}
          unreadCount={unreadCount}
          isNotificationOpen={isNotificationMenuOpen}
          isProfileOpen={isProfileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          onTogglePanel={togglePanel}
        />
      </div>

      {/* 알림 메뉴 판넬 */}
      {isLoggedIn ? (
        <NotificationDropdown
          ref={notificationMenuRef}
          isOpen={isNotificationMenuOpen}
          onClose={closePanel}
          onUnreadChange={setUnreadCount}
        />
      ) : null}

      {/* 프로필 메뉴 판넬 */}
      {user ? (
        <ProfileDropdown
          ref={profileMenuRef}
          user={user}
          isOpen={isProfileMenuOpen}
          onClose={closePanel}
          onLogout={logout}
        />
      ) : null}

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
