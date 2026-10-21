import { useQuery } from '@tanstack/react-query';

import { getEstimatePayments } from '@/lib/api/payment';

import { paymentKeys } from '@/hooks/features/payment/queries/keys';

/** 견적의 선수금·잔금 결제 현황
 * - 결제 승인(confirm) 성공 시 이 쿼리를 무효화한다
 */
export function useEstimatePaymentsQuery(estimateId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.byEstimate(estimateId),
    queryFn: () => getEstimatePayments(estimateId),
    enabled,
    meta: { name: '견적 결제 현황' },
  });
}
