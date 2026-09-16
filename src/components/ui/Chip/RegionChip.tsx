import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import SelectableChip, {
  type SelectableChipProps,
  type SelectableChipSize,
} from './SelectableChip';

export type RegionChipSize = SelectableChipSize;

interface RegionChipProps extends Omit<SelectableChipProps, 'size'> {
  size?: RegionChipSize;
}

/*
@ 지역 Chip 너비 CVA
- SelectableChip이 높이, padding, typography와 선택 상태를 담당합니다.
- RegionChip은 지역 버튼에 필요한 sm/md 너비만 담당합니다.
*/
export const regionChipVariants = cva('', {
  variants: {
    size: {
      sm: 'w-[49px]',
      md: 'w-[72px]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

/*
@ 단일 지역 Chip 사용 방법
- 전체 서비스 지역 목록은 RegionChipGroup을 사용합니다.
- 개별 지역 버튼이 필요할 때 children과 isSelected를 전달합니다.
- size는 sm(49x36px) / md(72x46px) 고정 크기만 제공합니다. 기본값은 sm입니다.
- 반응형은 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.

@ 최소 사용 예시
<RegionChip size="sm">서울</RegionChip>

const size = useBreakpointValue({
  mobile: 'sm',
  tablet: 'md',
  desktop: 'md',
});

<RegionChip size={size} isSelected>
  서울
</RegionChip>
*/
export default function RegionChip({
  size = 'sm',
  className,
  ...props
}: RegionChipProps) {
  return (
    <SelectableChip
      {...props}
      size={size}
      className={cn(regionChipVariants({ size }), className)}
    />
  );
}
