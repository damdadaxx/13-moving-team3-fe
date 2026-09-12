// 헤더 로그인 버튼 (링크)
import Link from 'next/link';

import { getGuestSigninPath } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import ButtonElement from './ButtonElement';

interface ButtonLoginProps {
  href?: React.ComponentProps<typeof Link>['href'];
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  'aria-label'?: string;
}

/** 로그인 버튼
 * - 링크 타입 (기본: 비회원 GNB → 고객 로그인)
 * - 기사님 로그인은 로그인 페이지에서 전환
 * - 표시 여부는 호출부 className으로 제어
 * - 태블릿/모바일은 패널 메뉴에서 이동 */
export default function ButtonLogin({
  href = getGuestSigninPath(),
  className,
  children = '로그인',
  disabled,
  isLoading,
  onClick,
  'aria-label': ariaLabel,
}: ButtonLoginProps) {
  return (
    <ButtonElement
      href={href}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'h-[44px] w-[116px] rounded-[12px] bg-orange-400 p-[16px] text-2lg-semibold text-gray-50',
        className,
      )}
    >
      {children}
    </ButtonElement>
  );
}
