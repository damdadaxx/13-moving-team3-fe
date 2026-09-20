import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchLikeStatus } from '@/lib/api/like';
import { getLikedMovers } from '@/lib/api/likes';

import { likeKeys } from '@/hooks/queries/likes/keys';

export const LIKED_MOVERS_PAGE_SIZE = 5;

export function useLikedMoversQuery() {
  return useInfiniteQuery({
    queryKey: likeKeys.mine(),
    queryFn: ({ pageParam }) =>
      getLikedMovers({
        cursor: pageParam,
        size: LIKED_MOVERS_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    meta: { name: '찜한 기사님 목록' },
  });
}

/** @ 기사님 찜 여부 쿼리 */
export function useLikeStatusQuery(moverId: string, enabled: boolean) {
  return useQuery({
    queryKey: likeKeys.byMover(moverId),
    queryFn: () => fetchLikeStatus(moverId),
    enabled: Boolean(moverId) && enabled,
    meta: { name: '기사님 찜 여부' },
  });
}
