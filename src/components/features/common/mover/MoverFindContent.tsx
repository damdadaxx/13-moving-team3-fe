// 기사님 찾기 페이지 본문 (검색 / 필터 / 목록 / 찜한 기사님)
'use client';

import { useState } from 'react';

import type { MoverListSortBy } from '@/types/mover';
import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

import { LIKED_MOVER_ID_PAGE_SIZE } from '@/lib/constants/mover';

import { useAuth } from '@/hooks/auth/useAuth';
import useDebounce from '@/hooks/common/useDebounce';
import { useLikedMoversQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import LikedMoverSection from '@/components/features/common/Mover/LikedMoverSection';
import MoverFilterBar from '@/components/features/common/Mover/MoverFilterBar';
import MoverList from '@/components/features/common/Mover/MoverList';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';

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
  const [sortBy, setSortBy] = useState<MoverListSortBy>('reviewCount');
  const debouncedKeyword = useDebounce(keyword.trim(), 300);

  /*
  @ 찜한 기사님 영역 노출 여부 (그리드 열 구성에 씀)
  - LikedMoverSection과 같은 쿼리 키라 네트워크 요청은 한 번만 나간다 (react-query 캐시 공유)
  - 비회원·기사님, 또는 찜한 기사님이 0명인 고객은 영역이 비어 그리지 않으므로
    오른쪽 327px 열도 만들지 않고 목록이 그 폭까지 넓어진다
  */
  const { role } = useAuth();
  const isCustomer = role === 'customer';
  const { data: likedPage } = useLikedMoversQuery({
    size: LIKED_MOVER_ID_PAGE_SIZE,
    enabled: isCustomer,
  });
  const hasLikedSection = isCustomer && (likedPage?.list.length ?? 0) > 0;

  function handleReset() {
    setRegion(undefined);
    setServiceType(undefined);
  }

  return (
    // 바깥은 화면 전체 폭, 안쪽 래퍼가 최대 너비(1248px)를 잡고 가운데 정렬한다
    <div
      className={cn(
        'w-full px-6 pb-[46px]',
        'tablet:px-[72px]',
        'desktop:px-6 desktop:pb-[193px]',
      )}
    >
      <div className={cn('w-full', 'desktop:mx-auto desktop:max-w-[1248px]')}>
        <h1
          className={cn(
            'sr-only',
            'desktop:not-sr-only desktop:block desktop:px-2 desktop:py-8 desktop:text-2xl-semibold desktop:text-black-500',
          )}
        >
          기사님 찾기
        </h1>

        <div
          className={cn(
            'desktop:grid desktop:gap-x-[54px]',
            hasLikedSection
              ? 'desktop:grid-cols-[minmax(0,1fr)_327px]'
              : 'desktop:grid-cols-[minmax(0,1fr)]',
          )}
        >
          <InputSearchbar
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="텍스트를 입력해 주세요."
            aria-label="기사님 별명 검색"
            className={cn(
              'mt-[16px] mb-1.5',
              'tablet:mt-[24px] tablet:mb-2.5',
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

          <LikedMoverSection className="desktop:sticky desktop:top-[112px] desktop:max-h-[calc(100dvh-112px-24px)] desktop:overflow-hidden desktop:col-start-2 desktop:row-start-3 desktop:mt-[37px] desktop:self-start" />
        </div>
      </div>
    </div>
  );
}
