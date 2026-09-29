'use client';

import { REGION_OPTIONS, type Region } from '@/types/region';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';

/*
@ 서비스 지역 선택 사용 방법
- REGION_OPTIONS의 전체 지역을 SelectableChip variant="region"으로 표시합니다.
- selectedRegions에는 현재 선택된 Region 값 배열을 전달합니다.
- onRegionClick에서 단일 선택 또는 복수 선택 로직을 부모가 결정합니다.
- size는 sm / md 고정 크기만 제공합니다. 기본값은 sm입니다.
- 반응형은 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.

@ 최소 사용 예시
<RegionChipGroup
  selectedRegions={selectedRegions}
  onRegionClick={handleRegionClick}
  size={useBreakpointValue('sm', 'md', 'md')}
/>
*/

interface RegionChipGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  selectedRegions: readonly Region[];
  onRegionClick: (region: Region) => void;
  size?: SelectableChipSize;
}

export default function RegionChipGroup({
  selectedRegions,
  onRegionClick,
  size = 'sm',
  className,
  ...props
}: RegionChipGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label="지역 선택"
      className={cn(
        'grid grid-cols-[repeat(5,max-content)] gap-[8px]',
        className,
      )}
    >
      {REGION_OPTIONS.map((region) => (
        <SelectableChip
          key={region.value}
          variant="region"
          size={size}
          isSelected={selectedRegions.includes(region.value)}
          onClick={() => onRegionClick(region.value)}
        >
          {region.label}
        </SelectableChip>
      ))}
    </div>
  );
}
