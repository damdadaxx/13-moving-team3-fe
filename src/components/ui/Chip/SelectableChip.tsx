import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

export type SelectableChipSize = 'sm' | 'md' | 'sm-tablet-md' | 'sm-desktop-md';

export interface SelectableChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: React.ReactNode;
  size?: SelectableChipSize;
  isSelected?: boolean;
}

/*
@ 선택 Chip CVA
- 공통 레이아웃, 선택 상태, 고정 크기와 반응형 크기를 한 곳에서 관리합니다.
- md 크기의 typography는 선택 상태에 따라 regular 또는 medium으로 구분합니다.
*/
export const selectableChipVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap',
    'rounded-[100px] border border-solid',
  ],
  {
    variants: {
      size: {
        sm: 'h-[36px] px-[12px] py-[6px] text-md-medium',
        md: 'h-[46px] px-[20px] py-[10px]',
        'sm-tablet-md': [
          'h-[36px] px-[12px] py-[6px] text-md-medium',
          'tablet:h-[46px] tablet:px-[20px] tablet:py-[10px]',
        ],
        'sm-desktop-md': [
          'h-[36px] px-[12px] py-[6px] text-md-medium',
          'desktop:h-[46px] desktop:px-[20px] desktop:py-[10px]',
        ],
      },
      isSelected: {
        true: 'border-orange-400 bg-orange-100 text-orange-400',
        false: 'border-gray-100 bg-background-100 text-black-400',
      },
    },
    compoundVariants: [
      {
        size: 'md',
        isSelected: true,
        className: 'text-2lg-medium',
      },
      {
        size: 'md',
        isSelected: false,
        className: 'text-2lg-regular',
      },
      {
        size: 'sm-tablet-md',
        isSelected: true,
        className: 'tablet:text-2lg-medium',
      },
      {
        size: 'sm-tablet-md',
        isSelected: false,
        className: 'tablet:text-2lg-regular',
      },
      {
        size: 'sm-desktop-md',
        isSelected: true,
        className: 'desktop:text-2lg-medium',
      },
      {
        size: 'sm-desktop-md',
        isSelected: false,
        className: 'desktop:text-2lg-regular',
      },
    ],
    defaultVariants: {
      size: 'sm',
      isSelected: false,
    },
  },
);

/*
@ 선택 Chip 사용 방법
- isSelected와 상태 변경은 사용하는 부모 컴포넌트가 관리합니다.
- size만 선택하면 높이, padding과 typography가 함께 적용됩니다.

@ size별 반응형 조합
- sm: mobile 36px / tablet 36px / desktop 36px
- md: mobile 46px / tablet 46px / desktop 46px
- sm-tablet-md: mobile 36px / tablet 46px / desktop 46px
- sm-desktop-md: mobile 36px / tablet 36px / desktop 46px

@ 최소 사용 예시
<SelectableChip
  size="sm-tablet-md"
  isSelected={isSelected}
  onClick={handleClick}
>
  서울
</SelectableChip>
*/
export default function SelectableChip({
  children,
  size = 'sm',
  isSelected = false,
  className,
  type = 'button',
  ...props
}: SelectableChipProps) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={isSelected}
      className={cn(selectableChipVariants({ size, isSelected }), className)}
    >
      {children}
    </button>
  );
}
