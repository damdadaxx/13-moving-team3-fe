// [메뉴] 예시
// [페이지] Chip UI

'use client';

import { useState } from 'react';

import RegionChip from '@/components/ui/Chip/RegionChip';
import RegionChipGroup, {
  type Region,
} from '@/components/ui/Chip/RegionChipGroup';
import {
  SERVICE_TYPES,
  type ServiceType,
} from '@/components/ui/Chip/serviceType';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import ServiceTypeTag, {
  DesignatedEstimateTag,
} from '@/components/ui/Chip/ServiceTypeTag';

export default function ChipsExamplePage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('SEOUL');
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([
    'SEOUL',
    'GYEONGGI',
  ]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >(['SMALL_MOVE']);

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
        <h1 className="text-xl-bold">Chip 컴포넌트 예시</h1>
        <p className="text-md-regular text-black-100">
          선택용 버튼과 표시 전용 태그를 구분하여 확인합니다.
        </p>
      </header>
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold">개별 선택 버튼</h2>

        <div className="flex flex-wrap items-center gap-[12px]">
          <RegionChip size="sm">기본</RegionChip>
          <RegionChip size="sm" isSelected>
            선택
          </RegionChip>
          <RegionChip size="md">기본</RegionChip>
          <RegionChip size="md" isSelected>
            선택
          </RegionChip>
        </div>
      </section>

      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold">지역 단일 선택</h2>

        <RegionChipGroup
          selectedRegions={[selectedRegion]}
          onRegionClick={setSelectedRegion}
        />

        <p className="text-md-regular text-black-100">
          현재 선택: {selectedRegion}
        </p>
      </section>

      <section className="flex flex-col gap-[16px]">
        <h2 className="text-lg-semibold">지역 복수 선택</h2>

        <RegionChipGroup
          selectedRegions={selectedRegions}
          onRegionClick={handleMultipleRegionClick}
        />

        <p className="text-md-regular text-black-100">
          현재 선택: {selectedRegions.join(', ') || '없음'}
        </p>
      </section>

      <section className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-lg-semibold">서비스 타입 선택 버튼</h2>
          <p className="text-md-regular text-black-100">
            아이콘 없이 표시되며 복수 선택할 수 있습니다.
          </p>
        </div>

        <ServiceTypeSelector
          selectedServiceTypes={selectedServiceTypes}
          onChange={setSelectedServiceTypes}
        />

        <p className="text-md-regular text-black-100">
          현재 선택: {selectedServiceTypes.join(', ') || '없음'}
        </p>
      </section>

      <section className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-lg-semibold">서비스 타입 표시 태그</h2>
          <p className="text-md-regular text-black-100">
            클릭되지 않는 화면 표시용 컴포넌트입니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[12px]">
          {SERVICE_TYPES.map((serviceType) => (
            <ServiceTypeTag
              key={`sm-${serviceType}`}
              serviceType={serviceType}
              size="sm"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-[12px]">
          {SERVICE_TYPES.map((serviceType) => (
            <ServiceTypeTag
              key={`md-${serviceType}`}
              serviceType={serviceType}
              size="md"
            />
          ))}
        </div>

        <div className="flex flex-col gap-[8px]">
          <h3 className="text-md-semibold">지정 견적 요청 태그</h3>

          <div className="flex flex-wrap items-center gap-[12px]">
            <DesignatedEstimateTag size="sm" />
            <DesignatedEstimateTag size="md" />
          </div>
        </div>
      </section>
    </main>
  );
}
