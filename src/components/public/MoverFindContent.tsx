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
@ 레이아웃 (Figma 기사님 찾기, Mobile First) — 값은 전부 Figma 좌표 기준
- 모바일: 좌우 24px / 검색 위아래 6px / 필터 위아래 16px / 목록 위 12px / 카드 간격 24px
- 태블릿: 좌우 72px(콘텐츠 600px) / 검색 위아래 10px / 필터 위아래 16px / 목록 위 24px / 카드 간격 24px
- 데스크톱: 1200px 가운데 정렬
  제목 영역 위아래 32px(좌우 8px) / 검색 위 3px / 필터 위 38px / 목록·찜한 기사님 위 37px / 카드 간격 20px
  [검색·필터·목록 819px | 54px | 찜한 기사님 327px]. 찜한 기사님은 목록과 같은 줄에서 시작 (grid 3번째 행)
- 하단 여백: Figma 아트보드 마지막 카드 아래 여백 (모바일 46px / 데스크톱 193px).
  태블릿 아트보드는 카드 4장에 맞춰 잘려 있어(10px) 모바일 값을 따른다
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
        'mx-auto w-full px-6 pb-[46px]',
        'tablet:px-[72px]',
        'desktop:max-w-[1248px] desktop:px-6 desktop:pb-[193px]',
      )}
    >
      <h1
        className={cn(
          'sr-only',
          'desktop:not-sr-only desktop:block desktop:px-2 desktop:py-8 desktop:text-2xl-semibold desktop:text-black-500',
        )}
      >
        기사님 찾기
      </h1>

      <div className="desktop:grid desktop:grid-cols-[minmax(0,1fr)_327px] desktop:gap-x-[54px]">
        <SearchBar
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="텍스트를 입력해 주세요."
          aria-label="기사님 별명 검색"
          className={cn(
            'my-1.5',
            'tablet:my-2.5',
            'desktop:col-start-1 desktop:mt-[3px] desktop:mb-0',
          )}
        />

        <MoverFilterBar
          region={region}
          serviceType={serviceType}
          sortBy={sortBy}
          onRegionChange={setRegion}
          onServiceTypeChange={setServiceType}
          onSortChange={setSortBy}
          onReset={handleReset}
          className={cn(
            'py-4',
            'desktop:col-start-1 desktop:mt-[38px] desktop:py-0',
          )}
        />

        <MoverList
          params={{
            keyword: debouncedKeyword || undefined,
            region,
            serviceType,
            sortBy,
          }}
          className={cn(
            'mt-3',
            'tablet:mt-6',
            'desktop:col-start-1 desktop:mt-[37px]',
          )}
        />

        <LikedMoverSection className="desktop:col-start-2 desktop:row-start-3 desktop:mt-[37px] desktop:self-start" />
      </div>
    </div>
  );
}
