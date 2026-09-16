// [메뉴] 예시
// [페이지] 공용 Chip / Tag 컴포넌트 사용법

'use client';

import { useState } from 'react';

import { SERVICE_TYPES, type ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import RegionChip from '@/components/ui/Chip/RegionChip';
import RegionChipGroup, {
  type Region,
} from '@/components/ui/Chip/RegionChipGroup';
import SelectableChip, {
  type SelectableChipSize,
} from '@/components/ui/Chip/SelectableChip';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

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

  const currentBreakpoint = useBreakpointValue({
    mobile: 'mobile (744px 미만)',
    tablet: 'tablet (744px ~ 1023px)',
    desktop: 'desktop (1024px 이상)',
  });

  /*
  @ 페이지별 size 조합
  - Chip/Tag는 sm | md만 받습니다. 반응형은 사용처에서 이 훅으로 넘깁니다.
  - tabletMd: 모바일 sm, 태블릿부터 md (폼 · 받았던 견적 · 기사님 찾기)
  - desktopMd: 모바일·태블릿 sm, 데스크톱만 md (작성 가능한 리뷰)
  */
  const tabletMdSize = useBreakpointValue<SelectableChipSize>({
    mobile: 'sm',
    tablet: 'md',
    desktop: 'md',
  });
  const desktopMdSize = useBreakpointValue<SelectableChipSize>({
    mobile: 'sm',
    tablet: 'sm',
    desktop: 'md',
  });

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
        <h1 className="text-orange-400 text-xl-bold">
          Chip · Tag 컴포넌트 예시
        </h1>
        <p className="text-md-regular text-gray-500">
          <code>Chip</code>은 클릭해서 고르는 버튼(
          <code>src/components/ui/Chip</code>), <code>Tag</code>는 클릭되지 않는
          표시용 라벨(<code>src/components/ui/Tag</code>)입니다. 둘 다
          <code>size</code>는 <code>sm</code> / <code>md</code>만 있고,
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

      {/* ---------------------------- A. Chip ---------------------------- */}
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-xl-bold">A. Chip — 선택 버튼</h2>
          <p className="text-md-regular text-gray-500">
            <code>button</code> + <code>aria-pressed</code>입니다. 선택 상태는
            부모가 관리합니다. 기반 컴포넌트는 <code>SelectableChip</code>이고,{' '}
            <code>RegionChip</code> / <code>ServiceTypeSelector</code>는 그 위에
            너비와 선택 로직을 얹은 것입니다.
          </p>
        </div>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            1. SelectableChip — 공통 선택 버튼
          </h3>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Chip/SelectableChip.tsx</code>. sm은 36px,
            md는 46px입니다. 기본값은 <code>sm</code>. 개별 선택 버튼이 필요할
            때 쓰고, 지역·서비스 타입은 아래 전용 컴포넌트를 쓰면 됩니다.
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
              size={tabletMdSize}
              isSelected={isChipSelected}
              onClick={() => setIsChipSelected((current) => !current)}
            >
              눌러서 선택 (현재 {tabletMdSize})
            </SelectableChip>
          </div>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">2. RegionChip — 지역 한 개</h3>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Chip/RegionChip.tsx</code>. SelectableChip에
            지역 너비(sm 49px / md 72px)만 더한 컴포넌트입니다. 지역 목록 전체가
            필요하면 <code>RegionChipGroup</code>을 씁니다.
          </p>
          <div className="flex flex-wrap items-center gap-[12px]">
            <RegionChip size="sm">서울</RegionChip>
            <RegionChip size="sm" isSelected>
              서울
            </RegionChip>
            <RegionChip size="md">서울</RegionChip>
            <RegionChip size="md" isSelected>
              서울
            </RegionChip>
          </div>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            3. RegionChipGroup — 지역 단일 선택
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
            size={tabletMdSize}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedRegion} · size={tabletMdSize}
          </p>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            4. RegionChipGroup — 지역 복수 선택
          </h3>
          <p className="text-md-regular text-gray-500">
            같은 컴포넌트입니다. 이미 선택된 지역을 다시 누르면 해제되도록
            부모에서 토글하면 됩니다.
          </p>
          <RegionChipGroup
            selectedRegions={selectedRegions}
            onRegionClick={handleMultipleRegionClick}
            size={tabletMdSize}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedRegions.join(', ') || '없음'}
          </p>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            5. ServiceTypeSelector — 이용 서비스 복수 선택
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
            size={tabletMdSize}
          />
          <p className="text-md-regular text-gray-500">
            현재 선택: {selectedServiceTypes.join(', ') || '없음'} · size=
            {tabletMdSize}
          </p>
        </section>
      </div>

      {/* ---------------------------- B. Tag ---------------------------- */}
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h2 className="text-xl-bold text-orange-400">
            B. Tag — 표시 전용 라벨
          </h2>
          <p className="text-md-regular text-gray-500">
            <code>src/components/ui/Tag/ServiceTypeTag.tsx</code>.{' '}
            <code>span</code>이라 클릭되지 않습니다. 서비스 타입과 지정 견적
            요청을 <code>variant</code>로 구분합니다. <code>size</code>는{' '}
            <code>sm</code>(26px) / <code>md</code>(32px)만 있고,{' '}
            <span className="font-bold text-orange-400">
              반응형은 컴포넌트가 처리하지 않습니다.
            </span>{' '}
            페이지마다 크기가 다르므로 사용처에서{' '}
            <span className="font-bold text-orange-400">
              <code>useBreakpointValue</code>로 <code>size</code>를 넘깁니다.
            </span>
          </p>
        </div>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            6. ServiceTypeTag — variant=&quot;service&quot;
          </h3>
          <p className="text-md-regular text-gray-500">
            아이콘 + 라벨입니다. <code>serviceType</code>을 반드시 넘깁니다.
          </p>
          <p className="text-sm-medium text-gray-500">size=&quot;sm&quot;</p>
          <div className="flex flex-wrap items-center gap-[12px]">
            {SERVICE_TYPES.map((serviceType) => (
              <ServiceTypeTag
                key={`sm-${serviceType}`}
                variant="service"
                serviceType={serviceType}
                size="sm"
              />
            ))}
          </div>
          <p className="text-sm-medium text-gray-500">size=&quot;md&quot;</p>
          <div className="flex flex-wrap items-center gap-[12px]">
            {SERVICE_TYPES.map((serviceType) => (
              <ServiceTypeTag
                key={`md-${serviceType}`}
                variant="service"
                serviceType={serviceType}
                size="md"
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[12px]">
          <h3 className="text-lg-semibold">
            7. ServiceTypeTag — variant=&quot;designatedEstimate&quot;
          </h3>
          <p className="text-md-regular text-gray-500">
            지정 견적 요청 태그입니다. <code>serviceType</code>은 넘기지
            않습니다.
          </p>
          <div className="flex flex-wrap items-center gap-[12px]">
            <ServiceTypeTag variant="designatedEstimate" size="sm" />
            <ServiceTypeTag variant="designatedEstimate" size="md" />
          </div>
        </section>

        <section className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-lg-semibold">8. 페이지별 반응형 size 조합</h3>
            <p className="text-md-regular text-gray-500">
              창 너비를 바꿔 보면 위 주황 글씨의 뷰포트와 함께 태그가 sm ↔ md로
              바뀝니다. 고정 크기가 필요한 화면은{' '}
              <code>size=&quot;sm&quot;</code> / <code>md</code>를 그대로 넘기면
              됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              받았던 견적 · 받았던 견적 상세 · 기사님 찾기
            </p>
            <p className="text-sm-medium text-gray-500">
              모바일 sm / 태블릿 md / 데스크톱 md · 현재 {tabletMdSize}
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="SMALL_MOVE"
              size={tabletMdSize}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              작성 가능한 리뷰 · 리뷰 쓰기 모달
            </p>
            <p className="text-sm-medium text-gray-500">
              모바일 sm / 태블릿 sm / 데스크톱 md · 현재 {desktopMdSize}
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="HOME_MOVE"
              size={desktopMdSize}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">내가 작성한 리뷰</p>
            <p className="text-sm-medium text-gray-500">
              size=&quot;sm&quot; 고정
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="OFFICE_MOVE"
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <p className="text-md-medium text-black-400">
              내 견적 관리 · 확정 견적 상세
            </p>
            <p className="text-sm-medium text-gray-500">
              size=&quot;md&quot; 고정
            </p>
            <ServiceTypeTag
              variant="service"
              serviceType="SMALL_MOVE"
              size="md"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
