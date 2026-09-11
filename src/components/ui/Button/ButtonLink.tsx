'use client';

import Link from 'next/link';

import { cn } from '@/utils/cn';

import ButtonContent from './ButtonContent';
import { buttonVariants, type ButtonVariantProps } from './ButtonStyles';

interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link>, ButtonVariantProps {
  /** 텍스트 오른쪽에 붙는 24x24 아이콘 (Figma의 solid-icon 변형) */
  icon?: React.ReactNode;
  /** 로딩 중이면 스피너만 보여주고 이동을 막는다 */
  isLoading?: boolean;
  /** <a>에는 disabled 속성이 없어서 prop으로 받아 직접 막는다 */
  disabled?: boolean;
}

export default function ButtonLink({
  variant,
  size,
  icon,
  href,
  isLoading = false,
  disabled = false,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  const isDisabled = disabled || isLoading;
  const classes = cn(buttonVariants({ variant, size }), className);
  const content = (
    <ButtonContent icon={icon} isLoading={isLoading}>
      {children}
    </ButtonContent>
  );

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
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
