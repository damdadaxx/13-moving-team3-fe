// [메뉴] 받은 요청 메뉴
// [페이지] 받은 요청
'use client';

import { useMemo, useState } from 'react';

import type { ServiceType } from '@/types/serviceType';
import Image from 'next/image';

import IcFilter from '@/assets/icons/ic_filter.svg';
import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';

import { cn } from '@/utils/cn';

import ReceivedRequestCard from '@/components/mover/ReceivedRequestCard';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';
import Sort, { type SortOption } from '@/components/ui/Sort';

import { MOCK_RECEIVED_REQUESTS, type ReceivedRequestMock } from './mockData';

type SortValue = 'moveDateAsc' | 'requestedAtAsc';

const SORT_OPTIONS: SortOption<SortValue>[] = [
  { value: 'moveDateAsc', label: '이사 빠른순' },
  { value: 'requestedAtAsc', label: '요청일 빠른순' },
];

const PAGE_SIZE = 4;

//MockData용 추후 BE 연결시 삭제 예정
function sortRequests(
  list: ReceivedRequestMock[],
  sortValue: SortValue,
): ReceivedRequestMock[] {
  switch (sortValue) {
    case 'moveDateAsc':
      return [...list].sort((a, b) => a.moveDate.localeCompare(b.moveDate));
    case 'requestedAtAsc':
      return [...list].sort((a, b) =>
        a.requestedAt.localeCompare(b.requestedAt),
      );
    default:
      return list;
  }
}

export default function MoverEstimateRequestPage() {
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<
    ServiceType[]
  >([]);
  const [designatedOnly, setDesignatedOnly] = useState(true);
  const [regionAvailableOnly, setRegionAvailableOnly] = useState(true);
  const [sortValue, setSortValue] = useState<SortValue>('moveDateAsc');
  const [requests, setRequests] = useState(MOCK_RECEIVED_REQUESTS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
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
    setVisibleCount(PAGE_SIZE);
  }

  function removeRequest(id: string) {
    setRequests((prev) => prev.filter((request) => request.id !== id));
  }

  const filteredRequests = useMemo(() => {
    const filtered = requests.filter((request) => {
      const matchesServiceType =
        selectedServiceTypes.length === 0 ||
        selectedServiceTypes.includes(request.serviceType);
      const matchesDesignated = !designatedOnly || request.isDesignated;
      const matchesRegion = !regionAvailableOnly || request.isRegionAvailable;

      return matchesServiceType && matchesDesignated && matchesRegion;
    });

    return sortRequests(filtered, sortValue);
  }, [
    requests,
    selectedServiceTypes,
    designatedOnly,
    regionAvailableOnly,
    sortValue,
  ]);

  const visibleRequests = filteredRequests.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRequests.length;

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () =>
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, filteredRequests.length),
      ),
    enabled: hasMore,
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
          {/* 퍼블리싱만: 검색 기능은 아직 연결하지 않는다 */}
          <InputSearchbar placeholder="어떤 고객님을 찾고 계세요?" />

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
              <span className="text-sm-semibold">
                {filteredRequests.length}건
              </span>
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
              전체 {filteredRequests.length}건
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-[12px]">
                <Checkbox
                  checked={designatedOnly}
                  onChange={(checked) => {
                    setDesignatedOnly(checked);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  label="지정 견적 요청"
                />
                <Checkbox
                  checked={regionAvailableOnly}
                  onChange={(checked) => {
                    setRegionAvailableOnly(checked);
                    setVisibleCount(PAGE_SIZE);
                  }}
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

          {visibleRequests.length > 0 && (
            <div className="grid grid-cols-1 gap-[24px] desktop:grid-cols-2">
              {visibleRequests.map((request) => (
                <ReceivedRequestCard
                  key={request.id}
                  request={request}
                  onRejectSuccess={removeRequest}
                  onSendSuccess={removeRequest}
                />
              ))}
            </div>
          )}

          {requests.length === 0 ? (
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
                아직 받은 요청이 없어요!
              </p>
            </div>
          ) : (
            visibleRequests.length === 0 && (
              <p className="py-[40px] text-center text-lg-regular text-gray-400">
                조건에 맞는 요청이 없어요.
              </p>
            )
          )}

          {hasMore && <div ref={sentinelRef} className="h-[1px] w-full" />}
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
                onChange={(checked) => {
                  setDesignatedOnly(checked);
                  setVisibleCount(PAGE_SIZE);
                }}
                label="지정 견적 요청"
              />
              <Checkbox
                checked={regionAvailableOnly}
                onChange={(checked) => {
                  setRegionAvailableOnly(checked);
                  setVisibleCount(PAGE_SIZE);
                }}
                label="서비스 가능 지역"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
