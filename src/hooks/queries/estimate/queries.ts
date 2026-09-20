// tanstack/react-query - estimate queries
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  ESTIMATE_PAGE_SIZE,
  getActiveEstimateRequest,
  getEstimates,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 진행 중인 견적 요청
- 있으면 견적 요청 폼 대신 "진행 중" 화면을 보여준다
- 견적 요청을 새로 만들면 mutation이 estimateKeys.all을 무효화해 이 쿼리도 다시 받는다
*/
export function useActiveEstimateRequestQuery() {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    meta: { name: '진행 중인 견적 요청' },
  });
}

/*
@ 받았던 견적 (내 견적 관리 > 받았던 견적 탭)
- status=closed → 백엔드 estimateFilter의 ACCEPTED,NOT_SELECTED,EXPIRED
- 견적 요청 단위 커서 페이지네이션. nextCursor가 null이면 마지막 페이지다
*/
const RECEIVED_ESTIMATES_PARAMS = {
  status: 'closed',
  size: ESTIMATE_PAGE_SIZE,
} as const;

export function useReceivedEstimatesQuery() {
  return useInfiniteQuery({
    queryKey: estimateKeys.list(RECEIVED_ESTIMATES_PARAMS),
    queryFn: ({ pageParam }) =>
      getEstimates({ ...RECEIVED_ESTIMATES_PARAMS, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    meta: { name: '받았던 견적 목록' },
  });
}
