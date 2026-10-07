// 기사님 찾기 페이지 본문 (검색 / 필터 / 목록 / 찜한 기사님)
'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { MoverListSortBy } from '@/types/mover';
import { REGIONS, type Region } from '@/types/region';
import { SERVICE_TYPES, type ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { LIKED_MOVER_ID_PAGE_SIZE } from '@/lib/constants/mover';

import useDebounce from '@/hooks/common/useDebounce';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useLikedMoversQuery } from '@/hooks/features/mover/queries/queries';

import { cn } from '@/utils/cn';

import LikedMoverSection from '@/components/features/common/Mover/LikedMoverSection';
import MoverFilterBar, {
  SORT_VALUES,
} from '@/components/features/common/Mover/MoverFilterBar';
import MoverList from '@/components/features/common/Mover/MoverList';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';

const DEFAULT_SORT_BY: MoverListSortBy = 'reviewCount';

function toRegion(value: string | null): Region | undefined {
  return REGIONS.includes(value as Region) ? (value as Region) : undefined;
}

function toServiceType(value: string | null): ServiceType | undefined {
  return SERVICE_TYPES.includes(value as ServiceType)
    ? (value as ServiceType)
    : undefined;
}

function toSortBy(value: string | null): MoverListSortBy {
  return SORT_VALUES.includes(value as MoverListSortBy)
    ? (value as MoverListSortBy)
    : DEFAULT_SORT_BY;
}

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
  const t = useTranslations('MoverFind');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
  @ 검색어·필터·정렬을 URL 쿼리로 들고 다닌다
  - 전에는 useState에만 있어서, 상세 페이지로 갔다가 돌아오면(특히 브라우저
    뒤로가기로 이 컴포넌트가 다시 마운트되는 경우) 조건이 초기값으로 리셋됐다.
    URL에 실어 두면 같은 주소로 돌아오는 순간 그대로 복원된다.
  - 검색어만 예외: 타이핑마다 URL을 바꾸면 history/네트워크가 들썩이므로
    입력은 로컬 state로 받고, debounce가 끝난 값만 URL에 반영한다
    (목록에 넘기는 값도 로컬에서 바로 계산한 debouncedKeyword를 쓴다 — URL
    왕복을 한 번 더 기다리지 않는다).
  */
  const region = toRegion(searchParams.get('region'));
  const serviceType = toServiceType(searchParams.get('serviceType'));
  const sortBy = toSortBy(searchParams.get('sortBy'));
  const urlKeyword = searchParams.get('q') ?? '';

  const [keyword, setKeyword] = useState(urlKeyword);
  const debouncedKeyword = useDebounce(keyword.trim(), 300);

  const updateQuery = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  // debounce가 끝난 검색어가 URL과 달라졌을 때만 반영한다 (매 렌더 반복 방지)
  useEffect(() => {
    if (debouncedKeyword === urlKeyword) return;
    updateQuery({ q: debouncedKeyword || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

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
    updateQuery({ region: undefined, serviceType: undefined });
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
          {t('title')}
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
            aria-label={t('searchLabel')}
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
            onRegionChange={(next) => updateQuery({ region: next })}
            onServiceTypeChange={(next) => updateQuery({ serviceType: next })}
            onSortChange={(next) =>
              updateQuery({
                sortBy: next === DEFAULT_SORT_BY ? undefined : next,
              })
            }
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
