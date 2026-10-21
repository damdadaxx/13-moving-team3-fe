// 기사님 찾기 페이지 본문 (검색 / 필터 / 목록 / 찜한 기사님)
'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { MoverAiSearchFilter, MoverListSortBy } from '@/types/mover';
import { REGIONS, type Region } from '@/types/region';
import { SERVICE_TYPES, type ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { LIKED_MOVER_ID_PAGE_SIZE } from '@/lib/constants/mover';

import useDebounce from '@/hooks/common/useDebounce';
import { useLoginRequiredModal } from '@/hooks/common/useLoginRequiredModal';
import { useToast } from '@/hooks/common/useToast';
import {
  AI_DAILY_LIMIT_CODE,
  useAiUsageQuery,
} from '@/hooks/features/ai/queries/queries';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useMoverAiSearchMutation } from '@/hooks/features/mover/queries/mutations';
import { useLikedMoversQuery } from '@/hooks/features/mover/queries/queries';

import { cn } from '@/utils/cn';

import LikedMoverSection from '@/components/features/common/Mover/LikedMoverSection';
import MoverAiSearchToggle from '@/components/features/common/Mover/MoverAiSearchToggle';
import MoverFilterBar, {
  SORT_VALUES,
} from '@/components/features/common/Mover/MoverFilterBar';
import MoverList from '@/components/features/common/Mover/MoverList';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';

const DEFAULT_SORT_BY: MoverListSortBy = 'reviewCount';
const AI_QUERY_MIN_LENGTH = 2;

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
  const tRegion = useTranslations('Region');
  const tServiceType = useTranslations('ServiceType');
  const tSort = useTranslations('MoverSort');
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

  /*
  @ AI 검색 모드 (URL ai=1)
  - 검색창에 문장을 쓰고 Enter를 누르면 Gemini가 지역·서비스·정렬·별명을 골라 준다.
    그 값을 기존 필터와 같은 URL 쿼리에 넣으므로 목록·뒤로가기·공유 링크는 지금처럼 동작한다.
  - 타이핑마다 부르지 않는다 (디바운스 없음, Enter/검색 아이콘으로만). 로그인 사용자만, 하루 5회.
  - 입력한 문장은 URL에 남기지 않는다 (개인정보가 섞일 수 있어서). 로컬 state로만 들고 있는다.
  */
  const { isLoggedIn, role } = useAuth();
  const isAiMode = isLoggedIn && searchParams.get('ai') === '1';
  const [aiQuery, setAiQuery] = useState('');
  const [aiResult, setAiResult] = useState<MoverAiSearchFilter | null>(null);
  // 조건을 하나도 못 찾은 문장. "이 문장으로 이름 검색하기" 버튼에 쓴다
  const [unmatchedAiQuery, setUnmatchedAiQuery] = useState<string | null>(null);
  const { data: aiUsage } = useAiUsageQuery(isLoggedIn);
  const aiSearchMutation = useMoverAiSearchMutation();
  const openLoginRequiredModal = useLoginRequiredModal();
  const { showToast } = useToast();

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
  // AI 모드에서는 q를 AI가 고른 별명이 차지하므로 건드리지 않는다
  useEffect(() => {
    if (isAiMode || debouncedKeyword === urlKeyword) return;
    updateQuery({ q: debouncedKeyword || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  /*
  @ 찜한 기사님 영역 노출 여부 (그리드 열 구성에 씀)
  - LikedMoverSection과 같은 쿼리 키라 네트워크 요청은 한 번만 나간다 (react-query 캐시 공유)
  - 비회원·기사님, 또는 찜한 기사님이 0명인 고객은 영역이 비어 그리지 않으므로
    오른쪽 327px 열도 만들지 않고 목록이 그 폭까지 넓어진다
  */
  const isCustomer = role === 'customer';
  const { data: likedPage } = useLikedMoversQuery({
    size: LIKED_MOVER_ID_PAGE_SIZE,
    enabled: isCustomer,
  });
  const hasLikedSection = isCustomer && (likedPage?.list.length ?? 0) > 0;

  function handleReset() {
    setAiResult(null);
    updateQuery({ region: undefined, serviceType: undefined });
  }

  function handleToggleAi() {
    if (!isLoggedIn) {
      openLoginRequiredModal();
      return;
    }
    setAiResult(null);
    setUnmatchedAiQuery(null);
    if (isAiMode) {
      // 이름 검색으로 돌아갈 때는 지금 URL의 q(AI가 고른 별명일 수 있음)를 입력창에 맞춘다
      setKeyword(urlKeyword);
      updateQuery({ ai: undefined });
      return;
    }
    updateQuery({ ai: '1' });
  }

  function getAiErrorMessage(error: unknown) {
    if (error instanceof HttpError) {
      if (error.code === AI_DAILY_LIMIT_CODE) return t('aiExhausted');
      if (error.code === 'TOO_MANY_REQUESTS') return t('aiTooMany');
    }
    return t('aiFailed');
  }

  function handleAiSearch(value: string) {
    const query = value.trim();
    if (aiSearchMutation.isPending) return;
    if (query.length < AI_QUERY_MIN_LENGTH) {
      showToast(t('aiTooShort'));
      return;
    }
    if (aiUsage?.moverSearch.remaining === 0) {
      showToast(t('aiExhausted'));
      return;
    }

    setUnmatchedAiQuery(null);
    aiSearchMutation.mutate(query, {
      onSuccess: ({ filter }) => {
        const hasCondition = Object.values(filter).some(
          (condition) => condition !== null,
        );
        if (!hasCondition) {
          setAiResult(null);
          setUnmatchedAiQuery(query);
          showToast(t('aiNoCondition'));
          return;
        }

        // 문장 전체가 새 조건이다. 언급하지 않은 조건은 비운다
        setAiResult(filter);
        updateQuery({
          region: filter.region ?? undefined,
          serviceType: filter.serviceType ?? undefined,
          sortBy:
            filter.sortBy && filter.sortBy !== DEFAULT_SORT_BY
              ? filter.sortBy
              : undefined,
          q: filter.keyword ?? undefined,
        });
      },
      onError: (error) => showToast(getAiErrorMessage(error)),
    });
  }

  // 조건을 못 찾은 문장을 그대로 별명 검색으로 넘긴다
  function handleSearchUnmatchedByName() {
    if (!unmatchedAiQuery) return;
    setKeyword(unmatchedAiQuery);
    setUnmatchedAiQuery(null);
    setAiResult(null);
    updateQuery({ ai: undefined });
  }

  const aiResultText = aiResult
    ? [
        aiResult.region && tRegion(aiResult.region),
        aiResult.serviceType && tServiceType(aiResult.serviceType),
        aiResult.sortBy && tSort(aiResult.sortBy),
        aiResult.keyword && `"${aiResult.keyword}"`,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

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
          {/* 검색 행: 그리드의 1행을 그대로 차지해야 찜한 기사님(row-start-3) 위치가 유지된다 */}
          <div
            className={cn(
              'mt-[16px] mb-1.5',
              'tablet:mt-[24px] tablet:mb-2.5',
              'desktop:col-start-1 desktop:mt-[3px] desktop:mb-0',
            )}
          >
            <div className="flex items-center gap-2">
              {isAiMode ? (
                <InputSearchbar
                  key="ai"
                  value={aiQuery}
                  onChange={(event) => setAiQuery(event.target.value)}
                  onSearch={handleAiSearch}
                  maxLength={100}
                  placeholder={t('aiPlaceholder')}
                  aria-label={t('aiToggle')}
                  aria-busy={aiSearchMutation.isPending || undefined}
                  className="min-w-0 flex-1"
                />
              ) : (
                <InputSearchbar
                  key="name"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  aria-label={t('searchLabel')}
                  className="min-w-0 flex-1"
                />
              )}
              <MoverAiSearchToggle
                isOn={isAiMode}
                usage={aiUsage?.moverSearch}
                onToggle={handleToggleAi}
              />
            </div>

            {isAiMode ? (
              <div
                className="mt-2 flex flex-col gap-1 text-xs-regular text-gray-500 desktop:text-sm-regular"
                aria-live="polite"
              >
                {aiSearchMutation.isPending ? (
                  <p>{t('aiPending')}</p>
                ) : aiResultText ? (
                  <p className="text-orange-400">
                    {t('aiResult', { conditions: aiResultText })}
                  </p>
                ) : (
                  <p>{t('aiHelper')}</p>
                )}
                {unmatchedAiQuery ? (
                  <button
                    type="button"
                    onClick={handleSearchUnmatchedByName}
                    className="cursor-pointer self-start text-orange-400 underline underline-offset-2"
                  >
                    {t('aiSearchByName')}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <MoverFilterBar
            region={region}
            serviceType={serviceType}
            sortBy={sortBy}
            // 필터를 직접 바꾸면 "AI가 찾은 조건" 문구는 더 이상 맞지 않으므로 지운다
            onRegionChange={(next) => {
              setAiResult(null);
              updateQuery({ region: next });
            }}
            onServiceTypeChange={(next) => {
              setAiResult(null);
              updateQuery({ serviceType: next });
            }}
            onSortChange={(next) => {
              setAiResult(null);
              updateQuery({
                sortBy: next === DEFAULT_SORT_BY ? undefined : next,
              });
            }}
            onReset={handleReset}
            className={cn(
              'py-4',
              'desktop:col-start-1 desktop:mt-[38px] desktop:py-0',
            )}
          />

          <MoverList
            params={{
              // AI 모드의 별명은 입력창이 아니라 URL(q)에서 온다
              keyword: (isAiMode ? urlKeyword : debouncedKeyword) || undefined,
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
