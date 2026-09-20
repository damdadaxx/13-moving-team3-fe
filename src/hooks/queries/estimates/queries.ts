import { useQuery } from '@tanstack/react-query';

import { fetchActiveEstimateRequest } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimates/keys';

/**
 * @ 활성 견적 요청 쿼리
 * - 진행 중인 견적 요청을 조회
 */
export function useActiveEstimateRequestQuery(enabled: boolean) {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: fetchActiveEstimateRequest,
    enabled,
    meta: { name: '진행 중인 견적 요청' },
  });
}
