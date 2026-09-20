// tanstack/react-query - estimate queries
import type {
  MyEstimateListQuery,
  ReceivedRequestQuery,
} from '@/types/estimate';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  ESTIMATE_PAGE_SIZE,
  getActiveEstimateRequest,
  getEstimateDetail,
  getEstimates,
  getMyEstimates,
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

/*
@ 내 견적 목록 - 커서 기반 무한 스크롤 (반려 요청, 보낸 견적 조회 등에서 status로 걸러 쓴다)
*/
export function useMyEstimatesQuery(query: MyEstimateListQuery) {
  return useInfiniteQuery({
    queryKey: estimateKeys.list(query),
    queryFn: ({ pageParam }) => getMyEstimates({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    meta: { name: '내 견적 목록' },
  });
}

/*
@ 견적 상세 - 목록에 없는 고객 이름(customer.name)을 카드에 표시하는 용도로 쓴다
*/
export function useEstimateDetailQuery(estimateId: string) {
  return useQuery({
    queryKey: estimateKeys.detail(estimateId),
    queryFn: () => getEstimateDetail(estimateId),
    meta: { name: '견적 상세' },
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
