// 공용 버튼 컴포넌트 (Figma: Button/solid/CTA, Button/outlined/CTA)
'use client';

import { TailSpin } from 'react-loader-spinner';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

/** buttonVariants
 * - Figma의 state(default/hover/disabled)는 prop이 아니라 CSS 상태로 옮김
 * - hover는 enabled일 때만 적용해야 disabled 위에 마우스를 올려도 색이 안 바뀜
 * - 너비는 Figma가 sm 327px / md 640px로 고정돼 있지만 CTA는 부모 폭을 꽉 채우는
 *   용도라 w-full로 두고, 필요하면 className으로 덮어쓴다
 * - padding은 variant마다 다르다 (solid 16px / outlined 좌우 24px·상하 16px)
 * - outlined의 disabled 색(#C4C4C4 테두리, #808080 텍스트)은 globals.css에 대응
 *   토큰이 없어서 임의값으로 둔다. 토큰이 추가되면 그걸로 교체할 것
 */
const buttonVariants = cva(
  'flex w-full cursor-pointer items-center justify-center transition disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        solid:
          'bg-primary-400 p-4 text-gray-50 enabled:hover:bg-primary-500 disabled:bg-gray-300',
        outlined:
          'border border-primary-400 px-6 py-4 text-primary-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] enabled:hover:bg-primary-100 enabled:hover:shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)] disabled:border-[#c4c4c4] disabled:text-[#808080]',
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
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
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
            <span className="flex size-6 shrink-0 items-center justify-center">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
