// tanstack/react-query - estimate queries
import type { ReceivedRequestQuery } from '@/types/estimate';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getActiveEstimateRequest,
  getReceivedRequests,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 진행 중인 견적 요청 + 그 요청에 들어온 견적 목록. 요청이 없으면 data가 null
- 견적요청 페이지: 있으면 폼 대신 "진행 중" 화면을 보여준다
- 대기 중인 견적 페이지: estimates를 그대로 목록에 쓴다
*/
export function useActiveEstimateRequestQuery() {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    meta: { name: '진행 중인 견적 요청' },
  });
}

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
