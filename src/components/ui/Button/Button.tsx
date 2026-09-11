// 페이지 이동이 목적이면 이게 아니라 ButtonLink를 쓴다.
'use client';

import { cn } from '@/utils/cn';

import ButtonContent from './ButtonContent';
import { buttonVariants, type ButtonVariantProps } from './ButtonStyles';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  /** 텍스트 오른쪽에 붙는 24x24 아이콘 (Figma의 solid-icon 변형) */
  icon?: React.ReactNode;
  /** 로딩 중이면 스피너만 보여주고 클릭을 막는다 */
  isLoading?: boolean;
}

export default function Button({
  variant,
  size,
  icon,
  isLoading = false,
  disabled = false,
  children,
  className,
  /* HTML 기본값이 submit이라 <form> 안에 두면 폼이 제출된다.
     button을 기본으로 두고, 제출 버튼이 필요하면 호출부에서 넘긴다 */
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      /* 네이티브 disabled만으론 색이 안 바뀐다. 공유 스타일이 ButtonLink에
         맞추느라 aria-disabled를 기준으로 잡고 있어서 같이 붙여준다 */
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      <ButtonContent icon={icon} isLoading={isLoading}>
        {children}
      </ButtonContent>
    </button>
  );
}
