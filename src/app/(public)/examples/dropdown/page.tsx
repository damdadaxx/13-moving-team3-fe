// [메뉴] 예시
// [페이지] Dropdown 사이즈/열 수 확인용
// 옵션은 백엔드 prisma enum(ServiceType, Region)을 그대로 따른다.
// Figma 2-line의 표시 순서(전체|서울, 경기|인천 …)가 Region enum 순서와 정확히 일치한다.

'use client';

import { useState } from 'react';

import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';

/** 백엔드 ServiceType + '전체' = 4개. Figma 1-line이 스크롤 없이 보여주는 개수와 같다 */
const SERVICE_OPTIONS: DropdownOption<string>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'SMALL_MOVE', label: '소형이사' },
  { value: 'HOME_MOVE', label: '가정이사' },
  { value: 'OFFICE_MOVE', label: '사무실이사' },
];

/** 백엔드 Region(17개) + '전체' = 18개 → 2열이면 9행이라 스크롤된다 */
const REGION_OPTIONS: DropdownOption<string>[] = [
  { value: 'ALL', label: '전체' },
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
];

export default function DropdownExamplePage() {
  const [service, setService] = useState<string>();
  const [region, setRegion] = useState<string>();
  const [serviceMd, setServiceMd] = useState<string>();
  const [regionMd, setRegionMd] = useState<string>();

  return (
    <div className="flex flex-col gap-10 p-6">
      <h1 className="text-xl-bold">Dropdown</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=sm</h2>
        <div className="flex items-start gap-6">
          <Dropdown
            options={SERVICE_OPTIONS}
            value={service}
            onChange={setService}
            placeholder="Text"
            className="w-[106px]"
          />
          <Dropdown
            options={REGION_OPTIONS}
            value={region}
            onChange={setRegion}
            placeholder="Text"
            columns={2}
            className="w-[106px]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=md</h2>
        <div className="flex items-start gap-10">
          <Dropdown
            size="md"
            options={SERVICE_OPTIONS}
            value={serviceMd}
            onChange={setServiceMd}
            placeholder="Text"
            className="w-40"
          />
          <Dropdown
            size="md"
            options={REGION_OPTIONS}
            value={regionMd}
            onChange={setRegionMd}
            placeholder="Text"
            columns={2}
            className="w-82"
          />
        </div>
      </section>
    </div>
  );
}
