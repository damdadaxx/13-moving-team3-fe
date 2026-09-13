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

  return (
    <div className="flex flex-col gap-10 p-6">
      <h1 className="text-xl-bold">Sort</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg-semibold">size=sm</h2>
        <div className="flex items-start gap-6">
          <Sort options={SORT_OPTIONS} value={sm} onChange={setSm} />
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
    </div>
  );
}
