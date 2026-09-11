// button / Link 공통 렌더러
'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_CLASS } from './ButtonStyles';

type ButtonElementOwnProps = {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  'aria-label'?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

/** href가 없으면 평범한 `<button>` */
type ButtonElementAsButtonProps = ButtonElementOwnProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonElementOwnProps
  > & {
    href?: undefined;
  };

/** - href가 있으면 `<Link>`
 * - `<a>`에는 disabled 속성이 없어서 우리 prop으로 따로 받음 */
type ButtonElementAsLinkProps = ButtonElementOwnProps &
  Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    keyof ButtonElementOwnProps | 'href'
  > & {
    href: React.ComponentProps<typeof Link>['href'];
  };

export type ButtonElementProps =
  ButtonElementAsButtonProps | ButtonElementAsLinkProps;

export default function ButtonElement({
  className,
  disabled,
  children,
  onClick,
  type = 'button',
  href,
  'aria-label': ariaLabel,
  ...props
}: ButtonElementProps) {
  const isDisabled = Boolean(disabled);
  const isLink = href !== undefined;
  const classes = cn(BUTTON_BASE_CLASS, className);

  /**
   * - href가 있고 활성이면 Link(클라이언트 라우팅)
   * - 비활성이면 href 없는 `<a>`
   * - href가 없으면 `<button>`
   */
  const Component: React.ElementType =
    isLink && !isDisabled ? Link : isLink ? 'a' : 'button';
  const isNativeButton = Component === 'button';

  /* button/Link/a 공통 클릭 처리
   * - 비활성이면 이동·onClick을 막음
   * - 활성이면 넘어온 onClick만 실행함 */
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Component
      className={classes}
      aria-label={ariaLabel}
      {...(isLink && isDisabled ? {} : (props as Record<string, unknown>))}
      {...(isLink && !isDisabled ? { href } : {})}
      {...(isNativeButton
        ? { type, disabled: isDisabled }
        : {
            role: 'link', // href 없는 커스텀 as 컴포넌트에도 link 역할 명시
            'aria-disabled': isDisabled || undefined, // 스크린 리더에 비활성 상태 전달
            tabIndex: isDisabled ? -1 : undefined, // disabled면 Tab 포커스 제외
          })}
      onClick={handleClick}
    >
      {children}
    </Component>
  );
}
