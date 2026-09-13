import { cn } from '@/utils/cn';

import SelectableChip, {
  type SelectableChipProps,
  type SelectableChipSize,
} from './SelectableChip';

/*
@ 단일 지역 Chip 사용 방법
- 전체 서비스 지역 목록은 RegionChipGroup을 사용합니다.
- 개별 지역 버튼이 필요할 때 children과 isSelected를 전달해 사용합니다.
- responsive는 모바일 49x36px, tablet 이상 72x46px로 변경됩니다.
- 고정 크기가 필요하면 size="sm" 또는 size="md"를 전달합니다.
*/

const REGION_CHIP_WIDTH_CLASS_NAMES: Record<SelectableChipSize, string> = {
  sm: 'w-[49px]',
  md: 'w-[72px]',
  responsive: 'w-[49px] tablet:w-[72px]',
};

export default function RegionChip({
  size = 'responsive',
  className,
  ...props
}: SelectableChipProps) {
  return (
    <SelectableChip
      {...props}
      size={size}
      className={cn(REGION_CHIP_WIDTH_CLASS_NAMES[size], className)}
    />
  );
}
