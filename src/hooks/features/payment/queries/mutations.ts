import type { PaymentType } from '@/types/payment';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { confirmPayment, createPaymentOrder } from '@/lib/api/payment';

import { paymentKeys } from '@/hooks/features/payment/queries/keys';

/** 결제 주문 생성
 * - 결제창을 열기 직전에 한 번 호출한다. 서버가 금액을 계산해 orderId와 함께 돌려준다
 */
export function useCreatePaymentOrderMutation(estimateId: string) {
  return useMutation({
    mutationFn: (type: PaymentType) => createPaymentOrder(estimateId, type),
  });
}

/** 결제 승인
 * - 성공하면 해당 견적의 결제 현황을 다시 받는다
 */
export function useConfirmPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: (payment) => {
      void queryClient.invalidateQueries({
        queryKey: paymentKeys.byEstimate(payment.estimateId),
      });
    },
  });
}
