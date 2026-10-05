// 헤더 프로필 드롭다운
import { Link } from '@/i18n/navigation';
import type { AuthUser } from '@/types/auth';
import type { Role } from '@/types/role';
import { cva } from 'class-variance-authority';
import { type Messages, useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import { HEADER_PANEL_IDS } from '@/components/ui/Header/types';

interface ProfileDropdownProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

/*
@ 역할별 프로필 메뉴
- 메뉴 이름은 번역 키(messages > ProfileMenu)로 두고, 컴포넌트에서 현재 언어로 바꾼다
*/
const PROFILE_MENU_DATA: Record<
  Role,
  { labelKey: keyof Messages['ProfileMenu']; href: string }[]
> = {
  customer: [
    {
      labelKey: 'editProfile',
      href: ROUTES.customerProfileEdit,
    },
    {
      labelKey: 'likedMovers',
      href: ROUTES.customerLikedMovers,
    },
    {
      labelKey: 'reviews',
      href: ROUTES.customerReviewsPending,
    },
  ],
  mover: [
    {
      labelKey: 'mypage',
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
  const t = useTranslations('ProfileMenu');

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
    <div
      id={HEADER_PANEL_IDS.profile}
      inert={!isOpen}
      className={profileDropdownPanel({ open: isOpen })}
    >
      <p className={profileDropdownItem({ variant: 'name' })}>
        {t('displayName', { name: user.name, role: user.role })}
      </p>
      {PROFILE_MENU_DATA[user.role].map((item, index, items) => (
        <Link
          key={item.labelKey}
          href={item.href}
          onClick={onClose}
          className={cn(
            profileDropdownItem({ variant: 'menu' }),
            index === items.length - 1 && 'desktop:mb-[10px]',
          )}
        >
          {t(item.labelKey)}
        </Link>
      ))}
      <button
        type="button"
        onClick={handleLogout}
        className={profileDropdownItem({ variant: 'logout' })}
      >
        {t('logout')}
      </button>
    </div>
  );
}
