// 기사님 찾기 페이지 본문 (검색 / 필터 / 목록 / 찜한 기사님)
'use client';

import { useState } from 'react';

import type { MoverSortBy, Region, ServiceType } from '@/types/mover';

import useDebounce from '@/hooks/common/useDebounce';

import { cn } from '@/utils/cn';

import LikedMoverSection from '@/components/public/LikedMoverSection';
import MoverFilterBar from '@/components/public/MoverFilterBar';
import MoverList from '@/components/public/MoverList';
import SearchBar from '@/components/ui/Form/SearchBar';

/*
@ 레이아웃 (Figma 기사님 찾기/비회원, Mobile First)
- 모바일: 좌우 24px, 검색 → 필터(위아래 16px) → 목록(12px 아래)
- 태블릿: 좌우 72px (콘텐츠 600px), 목록은 필터 24px 아래
- 데스크톱: 1200px 가운데 정렬, 페이지 제목 + [검색·필터·목록 | 찜한 기사님 327px] 2열
  찜한 기사님은 목록과 같은 줄에서 시작한다 (grid 3번째 행)
*/
export default function MoverFindContent() {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState<Region>();
  const [serviceType, setServiceType] = useState<ServiceType>();
  const [sortBy, setSortBy] = useState<MoverSortBy>('reviewCount');
  const debouncedKeyword = useDebounce(keyword.trim(), 300);

  function handleReset() {
    setRegion(undefined);
    setServiceType(undefined);
  }

  return (
    <div
      className={cn(
        'mx-auto w-full px-6 pb-10',
        'tablet:px-[72px]',
        'desktop:max-w-[1248px] desktop:px-6 desktop:pb-20',
      )}
    >
      <h1 className="sr-only desktop:not-sr-only desktop:block desktop:px-2 desktop:py-8 desktop:text-2xl-semibold desktop:text-black-500">
        기사님 찾기
      </h1>

      <div className="desktop:grid desktop:grid-cols-[minmax(0,1fr)_327px] desktop:gap-x-[54px]">
        <SearchBar
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="텍스트를 입력해 주세요."
          aria-label="기사님 별명 검색"
          className="mt-1.5 tablet:mt-2.5 desktop:col-start-1 desktop:mt-0"
        />

        <MoverFilterBar
          region={region}
          serviceType={serviceType}
          sortBy={sortBy}
          onRegionChange={setRegion}
          onServiceTypeChange={setServiceType}
          onSortChange={setSortBy}
          onReset={handleReset}
          className="py-4 desktop:col-start-1 desktop:mt-[38px] desktop:py-0"
        />

        <MoverList
          params={{
            keyword: debouncedKeyword || undefined,
            region,
            serviceType,
            sortBy,
          }}
          className="mt-3 tablet:mt-6 desktop:col-start-1 desktop:mt-[37px]"
        />

        <LikedMoverSection className="desktop:col-start-2 desktop:row-start-3 desktop:mt-[37px] desktop:self-start" />
      </div>
    </div>
  );
}
