// [메뉴] 예시
// [페이지] 공용 Chip 컴포넌트 사용법

'use client';

import { useState } from 'react';

import { type ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import RegionChipGroup, {
  type Region,
} from '@/components/ui/Chip/RegionChipGroup';
import SelectableChip from '@/components/ui/Chip/SelectableChip';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';

export default function ChipsExamplePage() {
  const [isChipSelected, setIsChipSelected] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region>('SEOUL');
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([
    'SEOUL',
    'GYEONGGI',
  ]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >(['SMALL_MOVE']);

  const currentBreakpoint = useBreakpointValue(
    'mobile (744px 미만)',
    'tablet (744px ~ 1023px)',
    'desktop (1024px 이상)',
  );

  function handleMultipleRegionClick(region: Region) {
    setSelectedRegions((currentRegions) => {
      const isSelected = currentRegions.includes(region);

      if (isSelected) {
        return currentRegions.filter(
          (currentRegion) => currentRegion !== region,
        );
      }

      return [...currentRegions, region];
    });
  }

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-[48px] p-[24px]">
      <header className="flex flex-col gap-[8px]">
        <h1 className="text-orange-400 text-xl-bold">Chip 컴포넌트 예시</h1>
        <p className="text-md-regular text-gray-500">
          <code>Chip</code>은 클릭해서 고르는 버튼입니다(
          <code>src/components/ui/Chip</code>). <code>size</code>는{' '}
          <code>sm</code> / <code>md</code>만 있고,
          <span className="text-orange-400 font-bold">
            반응형은 컴포넌트가 처리하지 않습니다.
          </span>
          페이지마다 크기가 다르므로 사용처에서{' '}
          <span className="text-orange-400 font-bold">
            <code>useBreakpointValue</code>로 <code>size</code>를 넘깁니다.
          </span>
        </p>
        <p className="text-md-medium text-orange-400">
          현재 뷰포트: {currentBreakpoint}
        </p>
      </header>

      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-xl-bold">Chip — 선택 버튼</h2>
          <p className="text-md-regular text-gray-500">
            <code>button</code> + <code>aria-pressed</code>입니다. 선택 상태는
            부모가 관리합니다. 지역은 <code>variant=&quot;region&quot;</code>,
            이용 서비스 목록은 <code>ServiceTypeSelector</code>를 씁니다.
          </p>
        </div>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            1. SelectableChip — 공통 선택 버튼
          </h3>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Chip/SelectableChip.tsx</code>. sm은 36px,
            md는 46px입니다. 기본 <code>variant=&quot;default&quot;</code>는
            라벨 너비를 따르고, 지역은 <code>variant=&quot;region&quot;</code>
            (sm 49px / md 72px)을 씁니다.
          </p>
          <div className="flex flex-wrap items-center gap-[12px]">
            <SelectableChip size="sm">기본 sm</SelectableChip>
            <SelectableChip size="sm" isSelected>
              선택 sm
            </SelectableChip>
            <SelectableChip size="md">기본 md</SelectableChip>
            <SelectableChip size="md" isSelected>
              선택 md
            </SelectableChip>
            <SelectableChip
              size={useBreakpointValue('sm', 'md', 'md')}
              isSelected={isChipSelected}
              onClick={() => setIsChipSelected((current) => !current)}
            >
              눌러서 선택
            </SelectableChip>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <SelectableChip variant="region" size="sm">
              서울
            </SelectableChip>
            <SelectableChip variant="region" size="sm" isSelected>
              서울
            </SelectableChip>
            <SelectableChip variant="region" size="md">
              서울
            </SelectableChip>
            <SelectableChip variant="region" size="md" isSelected>
              서울
            </SelectableChip>
          </div>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            2. RegionChipGroup — 지역 단일 선택
          </h3>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Chip/RegionChipGroup.tsx</code>. 17개 지역을
            한 번에 그립니다. 단일/복수는 부모가 <code>onRegionClick</code>에서
            정합니다. 단일이어도 <code>selectedRegions</code>는 배열입니다.
            아래는 모바일 sm, 태블릿부터 md 조합입니다.
          </p>
          <RegionChipGroup
            selectedRegions={[selectedRegion]}
            onRegionClick={setSelectedRegion}
            size={useBreakpointValue('sm', 'md', 'md')}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedRegion}
          </p>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            3. RegionChipGroup — 지역 복수 선택
          </h3>
          <p className="text-md-regular text-gray-500">
            같은 컴포넌트입니다. 이미 선택된 지역을 다시 누르면 해제되도록
            부모에서 토글하면 됩니다.
          </p>
          <RegionChipGroup
            selectedRegions={selectedRegions}
            onRegionClick={handleMultipleRegionClick}
            size={useBreakpointValue('sm', 'md', 'md')}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedRegions.join(', ') || '없음'}
          </p>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            4. ServiceTypeSelector — 이용 서비스 복수 선택
          </h3>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Chip/ServiceTypeSelector.tsx</code>.
            소형이사 / 가정이사 / 사무실이사를 아이콘 없이 복수 선택합니다. 토글
            로직은 컴포넌트 안에 있습니다. <code>onChange</code>로{' '}
            <code>ServiceType[]</code>를 받습니다.
          </p>
          <ServiceTypeSelector
            selectedServiceTypes={selectedServiceTypes}
            onChange={setSelectedServiceTypes}
            size={useBreakpointValue('sm', 'md', 'md')}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedServiceTypes.join(', ') || '없음'}
          </p>
        </section>
      </div>
    </main>
  );
}
