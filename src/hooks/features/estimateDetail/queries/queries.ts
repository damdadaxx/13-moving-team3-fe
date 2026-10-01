import type { EstimateDetail } from '@/types/estimate';
import type { MoverDetail } from '@/types/mover';
import { useQuery } from '@tanstack/react-query';

import {
  fetchActiveEstimateRequest,
  getEstimateDetail,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/features/estimateDetail/queries/keys';
import { useMoverDetailQuery } from '@/hooks/features/mover/queries/queries';

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
