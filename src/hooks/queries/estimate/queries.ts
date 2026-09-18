// tanstack/react-query - estimate queries
import type { ReceivedRequestQuery } from '@/types/estimate';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getReceivedRequests } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 받은 요청 목록 - 커서 기반 무한 스크롤
- query(정렬/필터)가 바뀌면 queryKey가 달라져 첫 페이지부터 다시 불러온다
  (커서는 "정렬된 목록에서의 위치"라 기준이 바뀌면 무효하다는 백엔드 설명과 일치)
*/
export function useReceivedRequestsQuery(query: ReceivedRequestQuery) {
  return useInfiniteQuery({
    queryKey: estimateKeys.received(query),
    queryFn: ({ pageParam }) =>
      getReceivedRequests({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    meta: { name: '받은 요청 목록' },
  });
}
