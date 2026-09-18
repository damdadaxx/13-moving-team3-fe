// tanstack/react-query - estimate queries
import type { MyEstimateListQuery } from '@/types/estimate';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getEstimateDetail, getMyEstimates } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

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
