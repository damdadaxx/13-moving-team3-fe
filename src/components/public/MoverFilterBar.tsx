// 기사님 찾기 필터 (지역 / 서비스 / 초기화 / 정렬)
'use client';

import type { MoverSortBy, Region, ServiceType } from '@/types/mover';

import {
  MOVER_SORT_LABEL,
  REGION_LABEL,
  SERVICE_TYPE_LABEL,
} from '@/lib/constants/mover';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';
import Sort, { type SortOption } from '@/components/ui/Sort';

/** '전체'는 필터를 해제하는 값. 선택하면 undefined로 바꿔 트리거에 placeholder(지역/서비스)가 보이게 한다 */
const ALL = 'ALL';

const REGION_OPTIONS: DropdownOption<Region | typeof ALL>[] = [
  { value: ALL, label: '전체' },
  ...(Object.entries(REGION_LABEL) as [Region, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

const SERVICE_OPTIONS: DropdownOption<ServiceType | typeof ALL>[] = [
  { value: ALL, label: '전체' },
  ...(Object.entries(SERVICE_TYPE_LABEL) as [ServiceType, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

const SORT_OPTIONS: SortOption<MoverSortBy>[] = (
  Object.entries(MOVER_SORT_LABEL) as [MoverSortBy, string][]
).map(([value, label]) => ({ value, label }));

interface MoverFilterBarProps {
  region?: Region;
  serviceType?: ServiceType;
  sortBy: MoverSortBy;
  onRegionChange: (region?: Region) => void;
  onServiceTypeChange: (serviceType?: ServiceType) => void;
  onSortChange: (sortBy: MoverSortBy) => void;
  onReset: () => void;
  className?: string;
}

/*
@ 사이즈 (Figma 기사님 찾기/비회원)
- Dropdown: 모바일·태블릿 sm(너비는 글자에 맞춤) / 데스크톱 md(160px)
- Sort: 모바일·태블릿 sm / 데스크톱 md
- 초기화: 데스크톱에만 있다. 모바일·태블릿은 드롭다운의 '전체'로 해제
*/
export default function MoverFilterBar({
  region,
  serviceType,
  sortBy,
  onRegionChange,
  onServiceTypeChange,
  onSortChange,
  onReset,
  className,
}: MoverFilterBarProps) {
  const dropdownSize = useBreakpointValue<'sm' | 'md'>({
    mobile: 'sm',
    tablet: 'sm',
    desktop: 'md',
  });

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {/* 드롭다운 간격: 모바일 8px / 태블릿·데스크톱 12px */}
      <div className={cn('flex items-center gap-2', 'tablet:gap-3')}>
        <Dropdown
          size={dropdownSize}
          columns={2}
          options={REGION_OPTIONS}
          value={region}
          placeholder="지역"
          onChange={(value) =>
            onRegionChange(value === ALL ? undefined : value)
          }
          className="desktop:w-40"
        />
        <Dropdown
          size={dropdownSize}
          options={SERVICE_OPTIONS}
          value={serviceType}
          placeholder="서비스"
          onChange={(value) =>
            onServiceTypeChange(value === ALL ? undefined : value)
          }
          className="desktop:w-40"
        />
        {/* Figma: 두 번째 드롭다운 끝에서 25px (gap 12 + 13), 드롭다운 가운데보다 2px 아래 (mt 4px) */}
        <button
          type="button"
          onClick={onReset}
          className={cn(
            'mt-1 ml-[13px] hidden cursor-pointer text-lg-medium text-gray-300 hover:text-gray-500',
            'desktop:block',
          )}
        >
          초기화
        </button>
      </div>
      <Sort
        size={dropdownSize}
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={onSortChange}
      />
    </div>
  );
}
