'use client';

import { REGION_OPTIONS, type Region } from '@/types/region';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';

/*
@ 서비스 지역 선택 사용 방법
- REGION_OPTIONS의 전체 지역을 SelectableChip으로 표시합니다.
- selectedRegions에는 현재 선택된 Region 값 배열을 전달합니다.
- onRegionClick에서 단일 선택 또는 복수 선택 로직을 부모가 결정합니다.
- size는 sm / md 고정 크기만 제공합니다. 기본값은 sm입니다.
- 한국어·중국어·일본어는 디자인 시안대로 한 줄에 5개씩 고정 배치합니다.
- 영어는 이름이 길어 고정 너비를 넘으므로 칩을 내용만큼 넓히고, 공간이 부족하면
  다음 줄로 넘깁니다. 언어별 배치를 여기서 결정해 사용하는 화면마다 중복하지 않습니다.
- englishTabletSixColumns는 넓은 태블릿 폼에서만 사용합니다. 등록 폼처럼 폭이 좁은
  화면은 기본 줄바꿈을 유지해야 하므로 필요한 사용처에서만 true를 전달합니다.
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
  englishTabletSixColumns?: boolean;
}

export default function RegionChipGroup({
  selectedRegions,
  onRegionClick,
  size = 'sm',
  englishTabletSixColumns = false,
  className,
  ...props
}: RegionChipGroupProps) {
  const t = useTranslations('Common');
  const tRegion = useTranslations('Region');
  const isEnglishLocale = useLocale() === 'en';

  return (
    <div
      {...props}
      role="group"
      aria-label={t('regionSelect')}
      className={cn(
        isEnglishLocale
          ? 'flex w-full min-w-0 flex-wrap gap-[8px]'
          : 'grid grid-cols-[repeat(5,max-content)] gap-[8px]',
        isEnglishLocale &&
          englishTabletSixColumns &&
          'tablet:grid tablet:grid-cols-[repeat(6,max-content)] desktop:flex',
        className,
      )}
    >
      {REGION_OPTIONS.map((region) => (
        <SelectableChip
          key={region.value}
          variant={isEnglishLocale ? 'regionFlexible' : 'region'}
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
