'use client';

import { useMemo, useState } from 'react';

import type { LikedMoverItem } from '@/types/like';
import Image from 'next/image';

import ImgEmpty from '@/assets/images/img_empty.png';

import { HttpError } from '@/lib/api/errors';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useToast } from '@/hooks/common/useToast';
import { useBulkDeleteLikesMutation } from '@/hooks/queries/likes/mutations';
import { useLikedMoversQuery } from '@/hooks/queries/likes/queries';

import { cn } from '@/utils/cn';

import LikedMoverCard, {
  type LikedMover,
} from '@/components/liked-movers/LikedMoverCard';
import Checkbox from '@/components/ui/Checkbox';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import { Skeleton } from '@/components/ui/Skeleton';

function toLikedMover(item: LikedMoverItem): LikedMover {
  return {
    moverId: item.moverId,
    serviceTypes: item.mover.serviceTypes,
    title: item.mover.shortIntro,
    description: item.mover.description,
    name: item.mover.nickname,
    imgUrl: item.mover.imgUrl,
    rating: item.ratingAvg,
    reviewCount: item.ratingCount,
    //경력 년수 계산 나머지는 버림. 만약 개월수도 필요하다면 %로 나머지를 구해서 넣어야한다.
    careerYears: Math.floor(item.mover.careerMonths / 12),
    confirmedCount: item.acceptedEstimateCount,
    likeCount: item.likeCount,
  };
}

export default function LikedMoverList() {
  const { showToast } = useToast();
  //삭제할 기사님의 ID값을 담는다.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLikedMoversQuery();
  const bulkDeleteMutation = useBulkDeleteLikesMutation();

  const movers = useMemo(
    //flatMap으로 페이지 데이터를 하나의 배열로 변환한다.
    () => data?.pages.flatMap((page) => page.list.map(toLikedMover)) ?? [],
    [data],
  );

  const selectedCount = selectedIds.length;
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  //전체선택 여부 확인
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const isDeleting = bulkDeleteMutation.isPending;

  //무한 스크롤 감시자 설정
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: () => {
      if (!hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    rootMargin: '0px',
  });

  //전체선택 체크박스 변경 시 선택된 기사님의 ID값을 업데이트한다.
  function handleToggleAll(checked: boolean) {
    setSelectedIds(checked ? movers.map((mover) => mover.moverId) : []);
  }

  //하나의 기사님 체크박스 변경 시 선택된 기사님의 ID값을 업데이트한다.
  function handleToggleOne(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  //선택한 기사님을 찜 목록에서 삭제한다.
  function handleDeleteSelected() {
    if (selectedCount === 0 || isDeleting) return;

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        showToast('선택한 기사님을 찜 목록에서 삭제했어요.');
      },
      onError: (error) => {
        const message =
          error instanceof HttpError
            ? error.message
            : '찜 삭제에 실패했어요. 잠시 후 다시 시도해주세요.';
        showToast(message);
      },
    });
  }

  //기사 목록 데이터 로딩
  if (isPending) {
    return (
      <div className="flex flex-col gap-[20px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            height={180}
            borderRadius={20}
            className="desktop:h-[230px]"
          />
        ))}
      </div>
    );
  }

  //에러 던져서 에러페이지를 띄운다.
  if (isError) {
    throw new Error('찜한 기사님 목록을 불러오지 못했어요.');
  }

  return (
    <div className="flex flex-col gap-[10px] tablet:gap-[18px] desktop:gap-[28px]">
      <div className="flex items-center justify-between">
        <Checkbox
          checked={isAllSelected}
          onChange={handleToggleAll}
          label={`전체선택(${selectedCount}/${totalCount})`}
        />
        <button
          type="button"
          disabled={selectedCount === 0 || isDeleting}
          onClick={handleDeleteSelected}
          className={cn(
            'px-[12px] text-md-regular tablet:text-lg-regular',
            selectedCount === 0 || isDeleting
              ? 'cursor-not-allowed text-gray-400'
              : 'cursor-pointer text-black-300',
          )}
        >
          선택 항목 삭제
        </button>
      </div>

      <ul className="flex flex-col gap-[20px] tablet:gap-[24px] desktop:gap-[20px]">
        {movers.length === 0 ? (
          <li
            className={cn(
              'flex flex-1 flex-col items-center justify-center',
              'min-h-[calc(100dvh-54px-120px)]',
              'desktop:min-h-[calc(100dvh-88px-160px)]',
            )}
          >
            <div className="relative mx-auto h-[196px] w-[240px] overflow-hidden">
              <Image
                src={ImgEmpty}
                alt="찜한 기사님이 없습니다."
                fill
                sizes="261px"
                className="object-cover"
              />
            </div>
            <span className="py-[80px] text-center text-lg-regular text-gray-400">
              찜한 기사님이 없습니다.
            </span>
          </li>
        ) : (
          movers.map((mover) => (
            <li key={mover.moverId}>
              <LikedMoverCard
                mover={mover}
                isSelected={selectedIds.includes(mover.moverId)}
                onSelectChange={(checked) =>
                  handleToggleOne(mover.moverId, checked)
                }
              />
            </li>
          ))
        )}
      </ul>

      {/* 다음 데이터가 있는지 확인하고 있다면 무한 스크롤 감시자를 설정한다. */}
      {hasNextPage ? (
        <div ref={sentinelRef} className="flex justify-center py-[16px]">
          {isFetchingNextPage ? <LoadingDisplay fullHeight={false} /> : null}
        </div>
      ) : null}
    </div>
  );
}
