// 기사님 찾기 필터 (지역 / 서비스 / 초기화 / 정렬)
'use client';

import type { MoverListSortBy } from '@/types/mover';
import type { Region } from '@/types/region';
import { REGIONS } from '@/types/region';
import { SERVICE_TYPES, type ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';
import Sort, { type SortOption } from '@/components/ui/Sort';

/** '전체'는 필터를 해제하는 값. 선택하면 undefined로 바꿔 트리거에 placeholder(지역/서비스)가 보이게 한다 */
const ALL = 'ALL';

/** 정렬 옵션 표시 순서 (라벨은 messages > MoverSort) */
const SORT_VALUES: MoverListSortBy[] = [
  'reviewCount',
  'rating',
  'career',
  'confirmedCount',
];

interface MoverFilterBarProps {
  region?: Region;
  serviceType?: ServiceType;
  sortBy: MoverListSortBy;
  onRegionChange: (region?: Region) => void;
  onServiceTypeChange: (serviceType?: ServiceType) => void;
  onSortChange: (sortBy: MoverListSortBy) => void;
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
  const t = useTranslations('MoverFind');
  const tRegion = useTranslations('Region');
  const tServiceType = useTranslations('ServiceType');
  const tSort = useTranslations('MoverSort');

  /* 옵션 순서는 REGIONS / SERVICE_TYPES (백엔드 enum = Figma 표시 순서), 라벨만 현재 언어로 바꾼다 */
  const regionOptions: DropdownOption<Region | typeof ALL>[] = [
    { value: ALL, label: t('all') },
    ...REGIONS.map((value) => ({ value, label: tRegion(value) })),
  ];
  const serviceOptions: DropdownOption<ServiceType | typeof ALL>[] = [
    { value: ALL, label: t('all') },
    ...SERVICE_TYPES.map((value) => ({ value, label: tServiceType(value) })),
  ];
  const sortOptions: SortOption<MoverListSortBy>[] = SORT_VALUES.map(
    (value) => ({ value, label: tSort(value) }),
  );

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {/* 드롭다운 간격: 모바일 8px / 태블릿·데스크톱 12px */}
      <div className={cn('flex items-center gap-2', 'tablet:gap-3')}>
        <Dropdown
          columns={2}
          options={regionOptions}
          value={region}
          placeholder={t('regionPlaceholder')}
          onChange={(value) =>
            onRegionChange(value === ALL ? undefined : value)
          }
          className="desktop:w-40"
        />
        <Dropdown
          options={serviceOptions}
          value={serviceType}
          placeholder={t('servicePlaceholder')}
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
          {t('reset')}
        </button>
      </div>
      <Sort options={sortOptions} value={sortBy} onChange={onSortChange} />
    </div>
  );
}
