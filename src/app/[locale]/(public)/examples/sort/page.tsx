// [메뉴] 예시
// [페이지] Sort 상태/사이즈 확인용
// 옵션은 Figma 원본과 동일. 각 정렬 기준은 백엔드 스키마에 근거가 있다.
// - 리뷰 많은순: MoverProfile.reviews 개수
// - 평점 높은순: Review.rating 평균 (@@index([moverId, rating]))
// - 경력 높은순: MoverProfile.careerMonths (@@index 주석 "기사님 찾기 - 경력 높은순")
// - 확정 많은순: Estimate 중 ACCEPTED 개수
// value는 mover 조회 API가 아직 정렬 파라미터를 정하지 않아 임시값이다.

'use client';

import { useState } from 'react';

import Sort, { type SortOption } from '@/components/ui/Sort';

const SORT_OPTIONS: SortOption<string>[] = [
  { value: 'reviewCount', label: '리뷰 많은순' },
  { value: 'rating', label: '평점 높은순' },
  { value: 'career', label: '경력 높은순' },
  { value: 'confirmedCount', label: '확정 많은순' },
];

export default function SortExamplePage() {
  const [sm, setSm] = useState('reviewCount');
  const [md, setMd] = useState('reviewCount');
  const [responsive, setResponsive] = useState('reviewCount');

  return (
    <div className="flex flex-col gap-10 p-6">
      <div>
        <h1 className="text-xl-bold">Sort</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          <code>size</code>는 <code>sm</code> / <code>md</code> /{' '}
          <code>responsive</code>입니다.{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리합니다.
          </span>{' '}
          기본값 <code>responsive</code>는 모바일·태블릿 sm, 데스크톱 md입니다.
          데스크톱 첫 화면이 sm→md로 튀지 않도록 CSS <code>desktop:</code>을
          쓰고, <code>useBreakpointValue</code>는 넘기지 않습니다.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=sm</h2>
        <div className="flex items-start gap-6">
          <Sort size="sm" options={SORT_OPTIONS} value={sm} onChange={setSm} />
        </div>
        <p className="text-md-regular text-gray-500">선택: {sm}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=md</h2>
        <div className="flex items-start gap-6">
          <Sort size="md" options={SORT_OPTIONS} value={md} onChange={setMd} />
        </div>
        <p className="text-md-regular text-gray-500">선택: {md}</p>
      </section>

      {/* 기사님 찾기 페이지: mobile·tablet은 sm, desktop은 md (Figma 기사님 찾기/비회원) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">
          반응형 (기본값 size=&quot;responsive&quot;)
        </h2>
        <p className="text-md-regular text-gray-500">
          size를 생략하면 모바일·태블릿 sm / 데스크톱 md입니다. 기사님 찾기
          페이지와 같은 조합입니다.
        </p>
        <div className="flex items-start gap-6">
          <Sort
            options={SORT_OPTIONS}
            value={responsive}
            onChange={setResponsive}
          />
        </div>
        <p className="text-md-regular text-gray-500">선택: {responsive}</p>
      </section>
    </div>
  );
}
