// tanstack/react-query - estimate queries
import type {
  EstimateDetail,
  MyEstimateListQuery,
  ReceivedRequestQuery,
} from '@/types/estimate';
import type { MoverDetail } from '@/types/mover';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';

import {
  getActiveEstimateRequest,
  getEstimateDetail,
  getMyEstimates,
  getReceivedRequests,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/features/estimate/queries/keys';
import { useMoverDetailQuery } from '@/hooks/features/mover/queries/queries';

/*
@ 진행 중인 견적 요청 + 그 요청에 들어온 견적 목록. 요청이 없으면 data가 null
- 견적요청 페이지: 있으면 폼 대신 "진행 중" 화면을 보여준다
- 대기 중인 견적 페이지: estimates를 그대로 목록에 쓴다
- enabled: 로그인 여부 등으로 조회를 미뤄야 할 때 쓴다 (기본은 바로 조회)
*/
export function useActiveEstimateRequestQuery(enabled = true) {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    enabled,
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
    placeholderData: keepPreviousData,
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

export type EstimateDetailWithMoverResult =
  | { status: 'loading' }
  | { status: 'estimate-error' }
  | { status: 'mover-error' }
  | { status: 'ready'; estimate: EstimateDetail; mover: MoverDetail };

/*
@ 견적 상세 + 기사님 상세
- 견적 실패 시 기사님 쿼리는 요청되지 않은 채 isPending이 true로 남고, 견적 결과부터 본다
*/
export function useEstimateDetailWithMover(
  estimateId: string,
): EstimateDetailWithMoverResult {
  const estimateQuery = useEstimateDetailQuery(estimateId);
  const estimate = estimateQuery.data;
  const moverId = estimate?.mover.moverId ?? '';
  const moverQuery = useMoverDetailQuery(moverId);

  // 견적 조회 대기
  if (estimateQuery.isPending) {
    return { status: 'loading' };
  }

  // 견적 조회 실패
  if (estimateQuery.isError || !estimate) {
    return { status: 'estimate-error' };
  }

  // 기사님 ID 없음
  if (!moverId) {
    return { status: 'mover-error' };
  }

  // 기사님 조회 대기
  if (moverQuery.isPending) {
    return { status: 'loading' };
  }

  // 기사님 조회 실패
  if (moverQuery.isError || !moverQuery.data) {
    return { status: 'mover-error' };
  }

  // 견적 상세 + 기사님 상세 조회 성공
  return {
    status: 'ready',
    estimate,
    mover: moverQuery.data,
  };
}
