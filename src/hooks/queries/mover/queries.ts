// tanstack/react-query - mover queries
import type { MoverListParams } from '@/types/mover';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getLikedMovers, getMovers, getMyMoverProfile } from '@/lib/api/mover';
import { MOVER_LIST_PAGE_SIZE } from '@/lib/constants/mover';

import { moverKeys } from '@/hooks/queries/mover/keys';

/*
@ 기사님 찾기 목록 (무한 스크롤)
- params(검색어/필터/정렬)가 쿼리 키라서 바뀌면 첫 페이지부터 새로 불러온다
*/
export function useMoverListInfiniteQuery(
  params: Omit<MoverListParams, 'cursor' | 'size'>,
) {
  const listParams = { ...params, size: MOVER_LIST_PAGE_SIZE };

  return useInfiniteQuery({
    queryKey: moverKeys.list(listParams),
    queryFn: ({ pageParam }) => getMovers({ ...listParams, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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

/*
@ 내 기사님 프로필 - "서비스 가능 지역" 필터에 필요한 serviceRegions를 가져오는 용도로 쓴다
*/
export function useMoverProfileQuery() {
  return useQuery({
    queryKey: moverKeys.profile(),
    queryFn: getMyMoverProfile,
    meta: { name: '내 기사님 프로필' },
  });
}
