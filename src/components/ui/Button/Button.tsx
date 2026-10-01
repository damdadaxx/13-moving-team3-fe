import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import { BUTTON_BASE_CLASS } from '@/components/ui/Button/ButtonStyles';

import ButtonElement, { type ButtonElementProps } from './ButtonElement';

export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonElementProps &
  ButtonVariantProps & {
    icon?: React.ReactNode;
  };

interface ButtonVariantProps extends VariantProps<typeof buttonVariants> {}

/*
@ Button CVA
- variant는 solid / outlined. 기본값은 solid입니다.
- color는 orange / gray. 기본값은 orange입니다. outlined와 함께 쓰고, solid는 color와 관계없이 orange입니다.
- size는 sm(54px) / md(60px) / lg(64px) 고정 크기만 제공합니다. 기본값은 sm입니다.
- 반응형은 컴포넌트가 처리하지 않습니다. 사용처에서 useBreakpointValue로 size를 넘깁니다.

@ 최소 사용 예시
<Button>견적 요청하기</Button>
<Button variant="outlined" color="gray">취소</Button>
*/
const buttonVariants = cva(BUTTON_BASE_CLASS, {
  variants: {
    variant: {
      solid:
        'bg-orange-400 p-4 text-gray-50 not-aria-disabled:hover:bg-orange-500 aria-disabled:bg-gray-300',
      outlined:
        'border px-6 py-4 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] not-aria-disabled:hover:shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)] aria-disabled:border-gray-200 aria-disabled:text-gray-500',
    },
    color: {
      orange: '',
      gray: '',
    },
    size: {
      sm: 'h-[54px] gap-1 rounded-[12px] text-lg-semibold',
      md: 'h-[60px] gap-2 rounded-[16px] text-2lg-semibold',
      lg: 'h-[64px] gap-2 rounded-[16px] text-2lg-semibold',
    },
  },
  compoundVariants: [
    {
      variant: 'outlined',
      color: 'orange',
      class:
        'border-orange-400 text-orange-400 not-aria-disabled:hover:bg-orange-100',
    },
    {
      variant: 'outlined',
      color: 'gray',
      class:
        'border-gray-200 text-gray-300 not-aria-disabled:hover:bg-background-300',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'sm',
    color: 'orange',
  },
});

export default function Button({
  variant,
  size = 'sm',
  color,
  icon,
  className,
  children,
  disabled,
  isLoading = false,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || isLoading;

  return (
    <ButtonElement
      {...props}
      disabled={disabled}
      isLoading={isLoading}
      aria-disabled={isDisabled || undefined}
      className={cn(buttonVariants({ variant, size, color }), className)}
    >
      {children}
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}
    </ButtonElement>
  );
}
