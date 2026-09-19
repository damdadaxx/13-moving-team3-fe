// [메뉴] 예시
// [페이지] Dropdown 반응형/열 수 확인용
// 옵션은 백엔드 prisma enum(ServiceType, Region)을 그대로 따른다.
// Figma 2-line의 표시 순서(전체|서울, 경기|인천 …)가 Region enum 순서와 정확히 일치한다.

'use client';

import { useState } from 'react';

import { REGION_OPTIONS } from '@/types/region';

import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';

/** 백엔드 ServiceType + '전체' = 4개. Figma 1-line이 스크롤 없이 보여주는 개수와 같다 */
const SERVICE_OPTIONS: DropdownOption<string>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'SMALL_MOVE', label: '소형이사' },
  { value: 'HOME_MOVE', label: '가정이사' },
  { value: 'OFFICE_MOVE', label: '사무실이사' },
];

/** 백엔드 Region(17개) + '전체' = 18개 → 2열이면 9행이라 스크롤된다 */
const REGION_DROPDOWN_OPTIONS: DropdownOption<string>[] = [
  { value: 'ALL', label: '전체' },
  ...REGION_OPTIONS,
];

export default function DropdownExamplePage() {
  const [service, setService] = useState<string>();
  const [region, setRegion] = useState<string>();

  return (
    <div className="flex flex-col gap-10 p-6">
      <div>
        <h1 className="text-xl-bold">Dropdown</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          <code>size</code> prop이 없습니다.{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리합니다.
          </span>{' '}
          사용처가 전부 모바일·태블릿 sm / 데스크톱 md라서 CSS{' '}
          <code>desktop:</code>으로 고정합니다. <code>useBreakpointValue</code>
          는 넘기지 않습니다.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">mobile·tablet: sm / desktop: md</h2>
        <div className="flex items-start gap-6 desktop:gap-10">
          <Dropdown
            options={SERVICE_OPTIONS}
            value={service}
            onChange={setService}
            placeholder="서비스"
            aria-label="서비스 종류"
          />
          <Dropdown
            options={REGION_DROPDOWN_OPTIONS}
            value={region}
            onChange={setRegion}
            placeholder="지역"
            aria-label="지역"
            columns={2}
          />
        </div>
      </section>
    </div>
  );
}
