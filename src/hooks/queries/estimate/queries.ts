// tanstack/react-query - estimate queries (useQuery)
import { useQuery } from '@tanstack/react-query';

import { getActiveEstimateRequest } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/** 진행 중인 견적 요청 + 그 요청에 들어온 견적 목록. 요청이 없으면 data가 null */
export function useActiveEstimateRequestQuery() {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    meta: { name: '진행 중인 견적 요청' },
  });
}
