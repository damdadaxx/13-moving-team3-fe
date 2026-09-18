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
import Image from 'next/image';

import IcFilter from '@/assets/icons/ic_filter.svg';
import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import useSearchInput from '@/hooks/common/useSearchInput';
import { useReceivedRequestsQuery } from '@/hooks/queries/estimate/queries';
import { useMoverProfileQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import ReceivedRequestCard from '@/components/mover/ReceivedRequestCard';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';
import Label from '@/components/ui/Form/Label';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import Modal from '@/components/ui/Modal/Modal';
import Sort, { type SortOption } from '@/components/ui/Sort';

const SORT_OPTIONS: SortOption<ReceivedRequestSortBy>[] = [
  { value: 'moveDate', label: '이사 빠른순' },
  { value: 'createdAt', label: '요청일 빠른순' },
];

const PAGE_SIZE = 10;

export default function MoverEstimateRequestPage() {
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [designatedOnly, setDesignatedOnly] = useState(true);
  // "서비스 가능 지역" 체크박스: 자격이 있는(지정이 아닌) 건은 서버가 이미
  // 내 서비스 지역으로만 걸러서 내려준다. 지정 건은 자격과 무관하게 보이므로,
  // 이 체크박스를 켰을 때만 내 프로필의 serviceRegions를 regions 필터로 보내
  // "내 서비스 지역 밖의 지정 건"을 걸러낸다
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

  const { data: moverProfile } = useMoverProfileQuery();
  const serviceRegions = moverProfile?.serviceRegions;

  const query = useMemo(
    () => ({
      sortBy: sortValue,
      serviceTypes:
        selectedServiceTypes.length > 0 ? selectedServiceTypes : undefined,
      regions:
        regionAvailableOnly && serviceRegions?.length
          ? serviceRegions
          : undefined,
      keyword: debouncedKeyword.trim() || undefined,
      isDesignated: designatedOnly ? true : undefined,
      size: PAGE_SIZE,
    }),
    [
      sortValue,
      selectedServiceTypes,
      regionAvailableOnly,
      serviceRegions,
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
            placeholder="어떤 고객님을 찾고 계세요?"
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
              <span className="text-sm-medium">전체</span>
              <span className="text-sm-semibold">{totalCount}건</span>
            </p>
            <div className="flex items-center gap-1">
              <Sort
                options={SORT_OPTIONS}
                value={sortValue}
                onChange={setSortValue}
              />
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
                aria-label="필터"
                className={cn('cursor-pointer')}
              >
                <IcFilter className="size-[32px]" />
              </button>
            </div>
          </div>

          {/* desktop: 카운트 별도 줄, 체크박스 + 정렬이 같은 줄 */}
          <div className="hidden desktop:flex desktop:flex-col desktop:gap-[24px]">
            <p className="flex items-center gap-[4px] text-2lg-semibold text-black-400">
              전체 {totalCount}건
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-[12px]">
                <Checkbox
                  checked={designatedOnly}
                  onChange={setDesignatedOnly}
                  label="지정 견적 요청"
                />
                <Checkbox
                  checked={regionAvailableOnly}
                  onChange={setRegionAvailableOnly}
                  label="서비스 가능 지역"
                />
              </div>

              <Sort
                options={SORT_OPTIONS}
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
                {totalCount === 0
                  ? '아직 받은 요청이 없어요!'
                  : '조건에 맞는 요청이 없어요.'}
              </p>
            </div>
          )}

          {hasNextPage && <div ref={sentinelRef} className="h-[1px] w-full" />}
        </div>

        <Modal
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="필터"
          variant="sheet"
          buttons={
            <Button size="sm" onClick={() => setIsFilterSheetOpen(false)}>
              확인
            </Button>
          }
          className={cn('py-[24px_32px] px-[24px]')}
        >
          <div>
            <Label variant="modal" className={cn('mb-[8px]')}>
              이사 유형
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
              지역 및 견적
            </Label>
            <div className="flex flex-col gap-[12px]">
              <Checkbox
                checked={designatedOnly}
                onChange={setDesignatedOnly}
                label="지정 견적 요청"
              />
              <Checkbox
                checked={regionAvailableOnly}
                onChange={setRegionAvailableOnly}
                label="서비스 가능 지역"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
