import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

export type SelectableChipSize = 'sm' | 'md';
export type SelectableChipVariant = 'default' | 'region';

export interface SelectableChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: React.ReactNode;
  size?: SelectableChipSize;
  variant?: SelectableChipVariant;
  isSelected?: boolean;
}

/*
@ 선택 Chip CVA
- variant="default"는 라벨 길이에 맞춰 너비가 늘어납니다.
- variant="region"은 지역 버튼 고정 너비(sm 49px / md 72px)를 적용합니다.
- size는 sm(36px) / md(46px) 고정 높이만 제공합니다.
- md 크기의 typography는 선택 상태에 따라 regular 또는 medium으로 구분합니다.
- 반응형은 컴포넌트가 처리하지 않습니다. 사용처에서 useBreakpointValue로 size를 넘깁니다.
*/
export const selectableChipVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap',
    'rounded-[100px] border border-solid disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default: '',
        region: '',
      },
      size: {
        sm: 'h-[36px] px-[12px] py-[6px] text-md-medium',
        md: 'h-[46px] px-[20px] py-[10px]',
      },
      isSelected: {
        true: 'border-orange-400 bg-orange-100 text-orange-400',
        false: 'border-gray-100 bg-background-100 text-black-400',
      },
    },
    compoundVariants: [
      {
        variant: 'region',
        size: 'sm',
        className: 'w-[49px]',
      },
      {
        variant: 'region',
        size: 'md',
        className: 'w-[72px]',
      },
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
    ],
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      isSelected: false,
    },
  },
);

/*
@ 선택 Chip 사용 방법
- isSelected와 상태 변경은 사용하는 부모 컴포넌트가 관리합니다.
- size는 sm(36px) / md(46px) 고정 크기만 제공합니다. 기본값은 sm입니다.
- 지역 버튼은 variant="region"을 전달합니다.
- 반응형은 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.

@ 최소 사용 예시
<SelectableChip
  size={useBreakpointValue('sm', 'md', 'md')}
  isSelected={isSelected}
  onClick={handleClick}
>
  소형이사
</SelectableChip>
<SelectableChip
  variant="region"
  size={useBreakpointValue('sm', 'md', 'md')}
  isSelected
>
  서울
</SelectableChip>
*/
export default function SelectableChip({
  children,
  size = 'sm',
  variant = 'default',
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
      className={cn(
        selectableChipVariants({ variant, size, isSelected }),
        className,
      )}
    >
      {children}
    </button>
  );
}
