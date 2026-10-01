// tanstack/react-query - mover queries
import type { MoverListQuery } from '@/types/mover';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import {
  fetchMoverDetail,
  fetchMoverList,
  getLikedMovers,
} from '@/lib/api/mover';
import { MOVER_LIST_PAGE_SIZE } from '@/lib/constants/mover';

import { moverKeys } from '@/hooks/features/mover/queries/keys';

/*
@ 기사님 찾기 목록 (무한 스크롤)
- params(검색어/필터/정렬)가 쿼리 키라서 바뀌면 첫 페이지부터 새로 불러온다
- 그동안 목록이 비면 화면이 깜빡이므로 placeholderData로 이전 목록을 유지한다
*/
export function useMoverListInfiniteQuery(
  params: Omit<MoverListQuery, 'cursor' | 'size'>,
) {
  const listParams = { ...params, size: MOVER_LIST_PAGE_SIZE };

  return useInfiniteQuery({
    queryKey: moverKeys.list(listParams),
    queryFn: ({ pageParam }) =>
      fetchMoverList({ ...listParams, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
    meta: { name: '기사님 목록' },
  });
}

/*
@ 찜한 기사님 (기사님 찾기 데스크톱 오른쪽 영역)
- 고객 로그인일 때만 호출한다 (enabled)
*/
export function useLikedMoversQuery({
  size,
  enabled,
}: {
  size: number;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: moverKeys.liked(size),
    queryFn: () => getLikedMovers({ size }),
    enabled,
    meta: { name: '찜한 기사님' },
  });
}

/** @ 기사님 상세 쿼리 */
export function useMoverDetailQuery(id: string) {
  return useQuery({
    queryKey: moverKeys.detail(id),
    queryFn: () => fetchMoverDetail(id),
    enabled: Boolean(id),
    meta: { name: '기사님 상세' },
  });
}
