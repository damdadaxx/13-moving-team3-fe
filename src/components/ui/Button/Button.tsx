// 공용 버튼 컴포넌트 (Figma: Button/solid/CTA, Button/outlined/CTA)
'use client';

import { TailSpin } from 'react-loader-spinner';

import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_CLASS } from './ButtonStyles';

/** buttonVariants
 * - Figma의 state(default/hover/disabled)는 prop이 아니라 CSS 상태로 옮김
 * - 상태 스타일은 :disabled/:enabled가 아니라 aria-disabled를 본다. href를 넘기면
 *   <a>로 렌더되는데 <a>는 :disabled/:enabled에 아예 매칭되지 않기 때문
 * - 너비는 Figma가 sm 327px / md 640px로 고정돼 있지만 CTA는 부모 폭을 꽉 채우는
 *   용도라 w-full로 두고, 필요하면 className으로 덮어쓴다
 * - padding은 variant마다 다르다 (solid 16px / outlined 좌우 24px·상하 16px)
 * - outlined의 disabled 색(#C4C4C4 테두리, #808080 텍스트)은 globals.css에 대응
 *   토큰이 없어서 임의값으로 둔다. 토큰이 추가되면 그걸로 교체할 것
 */
const buttonVariants = cva(BUTTON_BASE_CLASS, {
  variants: {
    variant: {
      solid:
        'bg-orange-400 p-4 text-gray-50 not-aria-disabled:hover:bg-orange-500 aria-disabled:bg-gray-300',
      outlined:
        'border border-orange-400 px-6 py-4 text-orange-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] not-aria-disabled:hover:bg-orange-100 not-aria-disabled:hover:shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)] aria-disabled:border-[#c4c4c4] aria-disabled:text-[#808080]',
    },
    size: {
      sm: 'h-[54px] gap-1 rounded-[12px] text-lg-semibold',
      md: 'h-[60px] gap-2 rounded-[16px] text-2lg-semibold',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

/** button으로 쓰든 link로 쓰든 똑같이 받는 prop */
type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  /** 텍스트 오른쪽에 붙는 24x24 아이콘 (Figma의 solid-icon 변형) */
  icon?: React.ReactNode;
  /** 로딩 중이면 스피너만 보여주고 클릭을 막는다 */
  isLoading?: boolean;
};

/** href가 없으면 평범한 <button> */
type ButtonAsButtonProps = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

/** href가 있으면 <Link>.
 *  <a>에는 disabled 속성이 없어서 우리 prop으로 따로 받는다 */
type ButtonAsLinkProps = ButtonOwnProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
    href: React.ComponentProps<typeof Link>['href'];
    disabled?: boolean;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export default function Button({
  variant,
  size,
  icon,
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || isLoading;
  const classes = cn(buttonVariants({ variant, size }), className);

  const content = isLoading ? (
    <TailSpin
      visible
      height={24}
      width={24}
      color="currentColor"
      ariaLabel="로딩 중"
      radius={1}
    />
  ) : (
    <>
      {children}
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    /* 비활성 링크를 <a href>로 두면 클릭·포커스·엔터가 전부 그대로 살아 있어서
       이동을 못 막는다. href를 아예 빼고 span으로 내리되 role=link를 남겨
       "링크인데 지금은 쓸 수 없다"는 의미는 보조기기에 그대로 전달한다 */
    if (isDisabled) {
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-busy={isLoading}
          className={classes}
        >
          {content}
        </span>
      );
    }

    return (
      <Link className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  );
}
