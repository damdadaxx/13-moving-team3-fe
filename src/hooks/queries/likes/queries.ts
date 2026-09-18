import { useInfiniteQuery } from '@tanstack/react-query';

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
