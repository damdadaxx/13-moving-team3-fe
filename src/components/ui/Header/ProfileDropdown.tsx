// 헤더 프로필 드롭다운
import type { AuthUser } from '@/types/auth';
import type { Role } from '@/types/role';
import { cva } from 'class-variance-authority';
import Link from 'next/link';

import { ROUTES } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import { HEADER_PANEL_IDS } from '@/components/ui/Header/types';

interface ProfileDropdownProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const PROFILE_MENU_DATA: Record<Role, { label: string; href: string }[]> = {
  customer: [
    {
      label: '프로필 수정',
      href: ROUTES.customerProfileEdit,
    },
    {
      label: '찜한 기사님',
      href: ROUTES.customerLikedMovers,
    },
    {
      label: '이사 리뷰',
      href: ROUTES.customerReviewsPending,
    },
  ],
  mover: [
    {
      label: '마이페이지',
      href: ROUTES.moverMypage,
    },
  ],
};

const profileDropdownItem = cva(
  'flex w-[140px] items-center px-[12px] whitespace-nowrap desktop:w-[240px]',
  {
    variants: {
      variant: {
        name: cn(
          'py-[8px] text-lg-bold text-black-400',
          'desktop:py-[14px] desktop:pl-[24px] desktop:pr-[12px] desktop:text-2lg-bold desktop:text-black-300',
        ),
        menu: cn(
          'cursor-pointer py-[8px] text-md-medium text-black-400',
          'hover:bg-background-200 transition-colors duration-300',
          'desktop:py-[14px] desktop:pl-[24px] desktop:pr-[12px] desktop:text-lg-medium',
        ),
        logout: cn(
          'cursor-pointer justify-center border-t border-line-100 pt-[12px] pb-[8px] text-xs-regular text-gray-500',
          'hover:text-black-500 transition-colors duration-300',
          'desktop:px-[12px] desktop:pt-[14px] desktop:pb-[8px] desktop:text-lg-regular',
        ),
      },
    },
  },
);

const profileDropdownPanel = cva(
  cn(
    'absolute top-[36px] right-[-58px] z-dropdown origin-top-right px-[6px] pt-[10px] pb-[6px]',
    'flex w-[152px] flex-col items-start rounded-[16px] border border-line-200 bg-gray-50 drop-shadow-[2px_2px_4px_rgba(224,224,224,0.2)]',
    'transition-[opacity,transform] duration-200 ease-out',
    'tablet:right-[-104px]',
    'desktop:top-[58px] desktop:w-[248px] desktop:px-[4px] desktop:pt-[16px]',
    'desktop:right-[max(-124px,calc(36px-max(72px,(100vw-1600px)/2)))]',
  ),
  {
    variants: {
      open: {
        true: 'pointer-events-auto opacity-100',
        false: 'pointer-events-none opacity-0',
      },
    },
  },
);

/**
 * 프로필 드롭다운
 * @param user - 사용자 정보
 * @param isOpen - 드롭다운 열림 여부
 * @param onClose - 드롭다운 닫기 핸들러
 * @param onLogout - 로그아웃 핸들러
 * @returns 프로필 드롭다운 컴포넌트
 */
export default function ProfileDropdown({
  user,
  isOpen,
  onClose,
  onLogout,
}: ProfileDropdownProps) {
  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
    <div
      id={HEADER_PANEL_IDS.profile}
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={profileDropdownPanel({ open: isOpen })}
    >
      <p className={profileDropdownItem({ variant: 'name' })}>
        {`${user.name} ${user.role === 'customer' ? '고객' : '기사'}님`}
      </p>
      {PROFILE_MENU_DATA[user.role].map((item, index, items) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onClose}
          className={cn(
            profileDropdownItem({ variant: 'menu' }),
            index === items.length - 1 && 'desktop:mb-[10px]',
          )}
        >
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className={profileDropdownItem({ variant: 'logout' })}
      >
        로그아웃
      </button>
    </div>
  );
}
