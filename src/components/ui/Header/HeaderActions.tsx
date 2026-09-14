// 헤더 우측 액션 (로그인 / 알림 / 프로필 / 햄버거)
import type { RefObject } from 'react';

import type { AuthUser } from '@/types/auth';

import IcAlarm from '@/assets/icons/ic_alarm.svg';
import IcMenu from '@/assets/icons/ic_menu.svg';
import IcProfile from '@/assets/icons/ic_profile.svg';

import { cn } from '@/utils/cn';

import ButtonLogin from '@/components/ui/Button/ButtonLogin';
import GuestActionsSkeleton from '@/components/ui/Header/GuestActionsSkeleton';
import LoggedInActionsSkeleton from '@/components/ui/Header/LoggedInActionsSkeleton';
import NotificationDropdown from '@/components/ui/Header/NotificationDropdown';
import ProfileDropdown from '@/components/ui/Header/ProfileDropdown';
import {
  HEADER_PANEL_IDS,
  type HeaderPanel,
} from '@/components/ui/Header/types';

interface HeaderActionsProps {
  isLoading: boolean;
  user: AuthUser | null;
  isLoggedInHint: boolean;
  unreadCount: number;
  isNotificationOpen: boolean;
  isProfileOpen: boolean;
  isMobileMenuOpen: boolean;
  notificationMenuRef: RefObject<HTMLDivElement | null>;
  profileMenuRef: RefObject<HTMLDivElement | null>;
  onTogglePanel: (panel: HeaderPanel) => void;
  onClosePanel: () => void;
  onUnreadChange: (count: number) => void;
  onLogout: () => void;
}

/**
 * 알림 unread-count 포맷팅
 * @param count - 알림 unread-count
 * @returns 알림 unread-count 포맷팅
 */
function formatUnreadCount(count: number) {
  if (count <= 0) {
    return null;
  }
  if (count > 99) {
    return '99+';
  }
  return String(count);
}

/**
 * 헤더 우측 액션
 * @param isLoading - 로딩 여부
 * @param user - 로그인 사용자
 * @param isLoggedInHint - 세션 확인 전 로그인 스켈레톤을 보여줄지
 * @param unreadCount - 읽지 않은 알림 수
 * @param isNotificationOpen - 알림 메뉴 열림 여부
 * @param isProfileOpen - 프로필 메뉴 열림 여부
 * @param isMobileMenuOpen - 모바일 메뉴 열림 여부
 * @param notificationMenuRef - 알림 메뉴 바깥 클릭 참조
 * @param profileMenuRef - 프로필 메뉴 바깥 클릭 참조
 * @param onTogglePanel - 패널 토글 핸들러
 * @param onClosePanel - 패널 닫기 핸들러
 * @param onUnreadChange - 읽지 않은 알림 수 변경 핸들러
 * @param onLogout - 로그아웃 핸들러
 * @returns 헤더 우측 액션 컴포넌트
 */
export default function HeaderActions({
  isLoading,
  user,
  isLoggedInHint,
  unreadCount,
  isNotificationOpen,
  isProfileOpen,
  isMobileMenuOpen,
  notificationMenuRef,
  profileMenuRef,
  onTogglePanel,
  onClosePanel,
  onUnreadChange,
  onLogout,
}: HeaderActionsProps) {
  const unreadCountLabel = formatUnreadCount(unreadCount);

  return (
    <div
      className={cn(
        'relative flex items-center gap-[24px]',
        'desktop:gap-[32px]',
      )}
    >
      {isLoading ? (
        isLoggedInHint ? (
          <LoggedInActionsSkeleton />
        ) : (
          <GuestActionsSkeleton />
        )
      ) : user ? (
        <>
          <div
            ref={notificationMenuRef}
            className={cn(
              'h-[24px] w-[24px]',
              'desktop:h-[36px] desktop:w-[36px]',
            )}
          >
            {/*
            @ 알림 패널 위치
            - 이 래퍼에는 relative를 주지 않는다
            - 패널은 HeaderActions(relative) 오른쪽에 붙어, 화면이 넓어져도 버튼 옆을 따라간다
            */}
            <button
              type="button"
              aria-expanded={isNotificationOpen}
              aria-controls={HEADER_PANEL_IDS.notification}
              aria-label={
                unreadCountLabel ? `알림 ${unreadCountLabel}개` : '알림'
              }
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onTogglePanel('notification')}
              className={cn('relative cursor-pointer')}
            >
              <IcAlarm aria-hidden className={cn('size-full')} />
              {unreadCountLabel ? (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-[-4px] left-[12px]',
                    'flex h-[16px] min-w-[16px] items-center justify-center rounded-full',
                    'bg-orange-400 px-[5px] text-xs-semibold leading-none text-gray-50',
                    'desktop:top-[-2px] desktop:left-[18px] desktop:h-[18px] desktop:min-w-[18px]',
                  )}
                >
                  {unreadCountLabel}
                </span>
              ) : null}
            </button>
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={onClosePanel}
              onUnreadChange={onUnreadChange}
            />
          </div>
          <div ref={profileMenuRef} className={cn('relative')}>
            <button
              type="button"
              aria-expanded={isProfileOpen}
              aria-controls={HEADER_PANEL_IDS.profile}
              aria-label="프로필 메뉴"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onTogglePanel('profile')}
              className={cn('flex cursor-pointer items-center gap-[16px]')}
            >
              <IcProfile
                aria-hidden
                className={cn(
                  'h-[24px] w-[24px]',
                  'desktop:h-[36px] desktop:w-[36px]',
                )}
              />
              <p
                className={cn(
                  'max-w-[200px] truncate',
                  'hidden text-2lg-medium text-black-500',
                  'desktop:block',
                )}
              >
                {user.name}
              </p>
            </button>
            <ProfileDropdown
              user={user}
              isOpen={isProfileOpen}
              onClose={onClosePanel}
              onLogout={onLogout}
            />
          </div>
        </>
      ) : (
        <ButtonLogin className={cn('hidden', 'desktop:flex')} />
      )}

      <button
        type="button"
        aria-expanded={isMobileMenuOpen}
        aria-controls={HEADER_PANEL_IDS.mobile}
        aria-label="메뉴"
        className={cn('cursor-pointer', 'desktop:hidden')}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => onTogglePanel('mobile')}
      >
        <IcMenu aria-hidden className={cn('h-[24px] w-[24px]')} />
      </button>
    </div>
  );
}
