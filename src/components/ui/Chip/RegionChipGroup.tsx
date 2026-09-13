'use client';

import { cn } from '@/utils/cn';

import RegionChip from './RegionChip';
import type { SelectableChipSize } from './SelectableChip';

/*
@ 서비스 지역 선택 사용 방법
- REGION_OPTIONS의 전체 지역을 선택형 Chip으로 표시합니다.
- selectedRegions에는 현재 선택된 Region 값 배열을 전달합니다.
- onRegionClick에서 단일 선택 또는 복수 선택 로직을 부모가 결정합니다.
- size를 생략하면 모바일은 sm, tablet 이상은 md가 적용됩니다.
*/

export const REGION_OPTIONS = [
  { value: 'SEOUL', label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'INCHEON', label: '인천' },
  { value: 'GANGWON', label: '강원' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'SEJONG', label: '세종' },
  { value: 'DAEJEON', label: '대전' },
  { value: 'JEONBUK', label: '전북' },
  { value: 'JEONNAM', label: '전남' },
  { value: 'GWANGJU', label: '광주' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'DAEGU', label: '대구' },
  { value: 'ULSAN', label: '울산' },
  { value: 'BUSAN', label: '부산' },
  { value: 'JEJU', label: '제주' },
] as const;

export type Region = (typeof REGION_OPTIONS)[number]['value'];

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
  size = 'responsive',
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
        <RegionChip
          key={region.value}
          size={size}
          isSelected={selectedRegions.includes(region.value)}
          onClick={() => onRegionClick(region.value)}
        >
          {region.label}
        </RegionChip>
      ))}
    </div>
  );
}
