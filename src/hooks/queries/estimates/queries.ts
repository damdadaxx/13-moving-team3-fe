import { useQuery } from '@tanstack/react-query';

import {
  fetchActiveEstimateRequest,
  getEstimateDetail,
} from '@/lib/api/estimate';

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

/**
 * @ 견적 상세 쿼리
 * - 대기 중인 견적/받은 견적 상세 화면에서 공용으로 쓴다
 */
export function useEstimateDetailQuery(estimateId: string) {
  return useQuery({
    queryKey: estimateKeys.detail(estimateId),
    queryFn: () => getEstimateDetail(estimateId),
    enabled: Boolean(estimateId),
    meta: { name: '견적 상세' },
  });
}
