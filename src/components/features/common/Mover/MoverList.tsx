// 기사님 찾기 목록 (무한 스크롤)
'use client';

import { useEffect, useRef } from 'react';

import type { MoverListQuery } from '@/types/mover';
import { useTranslations } from 'next-intl';

import { LIKED_MOVER_ID_PAGE_SIZE } from '@/lib/constants/mover';

import { useAuth } from '@/hooks/features/auth/useAuth';
import {
  useLikedMoversQuery,
  useMoverListInfiniteQuery,
} from '@/hooks/features/mover/queries/queries';

import { cn } from '@/utils/cn';

import MoverCard from '@/components/features/common/Mover/MoverCard';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import { Skeleton } from '@/components/ui/Skeleton';

interface MoverListProps {
  params: Omit<MoverListQuery, 'cursor' | 'size'>;
  className?: string;
}

const LIST_GAP = 'gap-6';

export default function MoverList({ params, className }: MoverListProps) {
  const t = useTranslations('MoverFind');
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMoverListInfiniteQuery(params);
  const { role } = useAuth();
  const { data: likedPage } = useLikedMoversQuery({
    size: LIKED_MOVER_ID_PAGE_SIZE,
    enabled: role === 'customer',
  });
  const likedIds = new Set(likedPage?.list.map((mover) => mover.id));
  const sentinelRef = useRef<HTMLDivElement>(null);

  /*
  @ 무한 스크롤
  - 목록 끝의 sentinel이 화면 근처(200px)에 들어오면 다음 페이지를 요청한다
  */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className={cn('flex flex-col', LIST_GAP, className)}>
        {/* count를 쓰면 Skeleton이 margin을 따로 넣어서 목록 gap과 겹친다 */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} height={226} borderRadius={16} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p
        role="alert"
        className={cn(
          'py-20 text-center text-lg-medium text-gray-400',
          className,
        )}
      >
        {error.message}
      </p>
    );
  }

  const movers = data.pages.flatMap((page) => page.list);

  if (movers.length === 0) {
    return (
      <p
        className={cn(
          'py-20 text-center text-lg-medium text-gray-400',
          className,
        )}
      >
        {t('empty')}
      </p>
    );
  }

  return (
    <div className={className}>
      <ul className={cn('flex flex-col', LIST_GAP)}>
        {movers.map((mover) => (
          <li key={mover.id}>
            <MoverCard mover={{ ...mover, isLiked: likedIds.has(mover.id) }} />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} aria-hidden />
      {isFetchingNextPage && (
        <LoadingDisplay size={40} fullHeight={false} className="mx-auto py-6" />
      )}
    </div>
  );
}
