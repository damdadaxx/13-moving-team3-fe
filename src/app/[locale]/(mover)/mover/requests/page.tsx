// [메뉴] 받은 요청 메뉴
// [페이지] 받은 요청
// API: GET /estimate-requests/received (커서 기반 무한 스크롤)
//
// 지정 견적 요청: 견적 보내기(PATCH status=PROPOSED) + 반려하기(PATCH status=REJECTED)
// 지정이 아닌 요청: 견적 보내기(POST /estimates)만 있다 — 반려 API 자체가 없다
//
// 지정 건 액션에 필요한 PATCH /estimates/{estimateId}의 estimateId는 목록 응답에
// 항목별로 같이 내려온다 (지정이 아니면 null)
'use client';

import { useMemo, useState } from 'react';

import type { ReceivedRequestSortBy } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcFilter from '@/assets/icons/ic_filter.svg';
import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import useSearchInput from '@/hooks/common/useSearchInput';
import { useReceivedRequestsQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';

import ReceivedRequestCard from '@/components/features/mover/EstimateRequest/ReceivedRequestCard';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';
import Label from '@/components/ui/Form/Label';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import Modal from '@/components/ui/Modal';
import Sort, { type SortOption } from '@/components/ui/Sort';

const PAGE_SIZE = 10;

export default function MoverEstimateRequestPage() {
  const t = useTranslations('MoverRequests');
  const tCommon = useTranslations('Common');
  const sortOptions: SortOption<ReceivedRequestSortBy>[] = [
    { value: 'moveDate', label: t('sortMoveDate') },
    { value: 'createdAt', label: t('sortRequestedAt') },
  ];
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [designatedOnly, setDesignatedOnly] = useState(true);
  const [regionAvailableOnly, setRegionAvailableOnly] = useState(true);
  const [sortValue, setSortValue] = useState<ReceivedRequestSortBy>('moveDate');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [hiddenRequestIds, setHiddenRequestIds] = useState<Set<string>>(
    new Set(),
  );
  const {
    value: keyword,
    debouncedValue: debouncedKeyword,
    onChange: setKeyword,
  } = useSearchInput();

  const filterChipSize = useBreakpointValue({
    mobile: 'sm' as const,
    tablet: 'md' as const,
    desktop: 'md' as const,
  });
  const isDesktop = useBreakpointValue(false, false, true);
  const [wasDesktop, setWasDesktop] = useState(isDesktop);

  // 모바일·태블릿 전용 필터 시트가 열린 채로 데스크톱 크기가 되면 닫는다
  // (렌더 중 상태를 조정하는 React 권장 패턴: effect에서 setState하지 않는다)
  if (isDesktop !== wasDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) setIsFilterSheetOpen(false);
  }

  function handleServiceTypesChange(next: ServiceType[]) {
    setSelectedServiceTypes(next);
  }

  function hideRequest(estimateRequestId: string) {
    setHiddenRequestIds((prev) => new Set(prev).add(estimateRequestId));
  }

  const query = useMemo(
    () => ({
      sortBy: sortValue,
      serviceTypes:
        selectedServiceTypes.length > 0 ? selectedServiceTypes : undefined,
      keyword: debouncedKeyword.trim() || undefined,
      isDesignated: designatedOnly ? true : undefined,
      isServiceArea: regionAvailableOnly ? true : undefined,
      size: PAGE_SIZE,
    }),
    [
      sortValue,
      selectedServiceTypes,
      regionAvailableOnly,
      debouncedKeyword,
      designatedOnly,
    ],
  );

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReceivedRequestsQuery(query);

  const requests = useMemo(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data],
  );
  const visibleRequests = useMemo(
    () =>
      requests.filter(
        (request) => !hiddenRequestIds.has(request.estimateRequestId),
      ),
    [requests, hiddenRequestIds],
  );
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  // totalCount는 필터가 적용된 건수라, 빈 화면 문구는 필터 사용 여부로 나눈다
  const hasActiveFilter =
    designatedOnly ||
    regionAvailableOnly ||
    selectedServiceTypes.length > 0 ||
    Boolean(query.keyword);

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => fetchNextPage(),
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-col gap-[40px] px-[30px] py-[12px_74px] bg-gray-50',
        'tablet:px-[72px]',
      )}
    >
      <div
        className={cn(
          'flex flex-col',
          'desktop:mx-auto desktop:w-full desktop:max-w-[1200px]',
        )}
      >
        {/* 검색바 */}
        <div className="flex flex-col gap-[24px] max-w-[1200px]">
          <InputSearchbar
            placeholder={t('searchPlaceholder')}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          <ServiceTypeSelector
            selectedServiceTypes={selectedServiceTypes}
            onChange={handleServiceTypesChange}
            size={filterChipSize}
            className={cn('hidden desktop:flex')}
          />
        </div>

        <div
          className={cn(
            'flex flex-col gap-[16px] mt-[16px]',
            'tablet:mt-[24px] tablet:gap-[20px]',
            'desktop:gap-[24px] desktop:mt-[40px]',
          )}
        >
          {/* mobile·tablet: 카운트 + 정렬 + 필터 아이콘이 한 줄 */}
          <div
            className={cn(
              'flex items-center justify-between',
              'desktop:hidden',
            )}
          >
            <p className="flex items-center gap-1 text-black-400">
              <span className="text-sm-medium">{t('total')}</span>
              <span className="text-sm-semibold">
                {t('count', { count: totalCount })}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <Sort
                options={sortOptions}
                value={sortValue}
                onChange={setSortValue}
              />
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                aria-label={tCommon('filter')}
                className={cn('cursor-pointer')}
              >
                <IcFilter className="size-[32px]" />
              </button>
            </div>
          </div>

          {/* desktop: 카운트 별도 줄, 체크박스 + 정렬이 같은 줄 */}
          <div className="hidden desktop:flex desktop:flex-col desktop:gap-[24px]">
            <p className="flex items-center gap-[4px] text-2lg-semibold text-black-400">
              {t('totalCount', { count: totalCount })}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-[12px]">
                <Checkbox
                  checked={designatedOnly}
                  onChange={setDesignatedOnly}
                  label={t('designatedOnly')}
                />
                <Checkbox
                  checked={regionAvailableOnly}
                  onChange={setRegionAvailableOnly}
                  label={t('serviceAreaOnly')}
                />
              </div>

              <Sort
                options={sortOptions}
                value={sortValue}
                onChange={setSortValue}
              />
            </div>
          </div>

          {isPending && <LoadingDisplay />}

          {isError && (
            <p className="py-[40px] text-center text-lg-regular text-red-200">
              {error.message}
            </p>
          )}

          {!isPending && !isError && visibleRequests.length > 0 && (
            <div className="grid grid-cols-1 gap-[24px] desktop:grid-cols-2">
              {visibleRequests.map((request) => (
                <ReceivedRequestCard
                  key={request.estimateRequestId}
                  request={request}
                  estimateId={request.estimateId ?? undefined}
                  onRejectSuccess={hideRequest}
                  onSendSuccess={hideRequest}
                />
              ))}
            </div>
          )}

          {!isPending && !isError && visibleRequests.length === 0 && (
            <div
              className={cn(
                'flex flex-col items-center pt-[80px]',
                'desktop:gap-[32px] desktop:pt-[180px]',
              )}
            >
              <Image
                src={ImgEmptyBeaver}
                alt=""
                width={240}
                height={240}
                className="size-[240px] object-contain"
                aria-hidden
                loading="eager"
                priority
              />
              <p className="text-lg-regular text-gray-400 desktop:text-xl-regular">
                {hasActiveFilter ? t('emptyFiltered') : t('empty')}
              </p>
            </div>
          )}

          {hasNextPage && <div ref={sentinelRef} className="h-[1px] w-full" />}
        </div>

        <Modal
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title={tCommon('filter')}
          variant="sheet"
          buttons={
            <Button size="sm" onClick={() => setIsFilterSheetOpen(false)}>
              {tCommon('confirm')}
            </Button>
          }
          className={cn('py-[24px_32px] px-[24px]')}
        >
          <div>
            <Label variant="modal" className={cn('mb-[8px]')}>
              {t('moveType')}
            </Label>
            <ServiceTypeSelector
              selectedServiceTypes={selectedServiceTypes}
              onChange={handleServiceTypesChange}
              size="sm"
              className={cn('mb-[28px]')}
            />
          </div>

          <div>
            <Label variant="modal" className={cn('mb-[8px]')}>
              {t('regionAndEstimate')}
            </Label>
            <div className="flex flex-col gap-[12px]">
              <Checkbox
                checked={designatedOnly}
                onChange={setDesignatedOnly}
                label={t('designatedOnly')}
              />
              <Checkbox
                checked={regionAvailableOnly}
                onChange={setRegionAvailableOnly}
                label={t('serviceAreaOnly')}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
