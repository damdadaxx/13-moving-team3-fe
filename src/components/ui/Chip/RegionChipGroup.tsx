'use client';

import { REGION_OPTIONS, type Region } from '@/types/region';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';

/*
@ 서비스 지역 선택 사용 방법
- REGION_OPTIONS의 전체 지역을 SelectableChip으로 표시합니다.
- selectedRegions에는 현재 선택된 Region 값 배열을 전달합니다.
- 단일 선택 또는 복수 선택 로직은 부모의 onRegionClick에서 결정합니다.
- size는 sm / md 고정 크기를 제공하며, 기본값은 sm입니다.

@ 반응형 배치
- '전남광주'처럼 긴 지역명이 있어 칩 너비를 내용에 맞추고, 공간이 부족하면 줄바꿈합니다.
- 반응형 칩 크기는 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.

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
  const t = useTranslations('Common');
  const tRegion = useTranslations('Region');

  return (
    <div
      {...props}
      role="group"
      aria-label={t('regionSelect')}
      className={cn('flex w-full min-w-0 flex-wrap gap-[8px]', className)}
    >
      {REGION_OPTIONS.map((region) => (
        <SelectableChip
          key={region.value}
          variant="regionFlexible"
          size={size}
          isSelected={selectedRegions.includes(region.value)}
          onClick={() => onRegionClick(region.value)}
        >
          {tRegion(region.value)}
        </SelectableChip>
      ))}
    </div>
  );
}
