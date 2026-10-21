import type {
  ConfirmPaymentInput,
  ConfirmedPayment,
  EstimatePayments,
  PaymentOrder,
  PaymentType,
} from '@/types/payment';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** GET /estimates/:estimateId/payments - 선수금·잔금 결제 현황 */
export function getEstimatePayments(
  estimateId: string,
): Promise<EstimatePayments> {
  return clientFetch<EstimatePayments>(
    ENDPOINTS.payment.byEstimate(estimateId),
  );
}

/** POST /estimates/:estimateId/payments - 결제창에 넘길 주문 생성 (금액은 서버가 계산) */
export function createPaymentOrder(
  estimateId: string,
  type: PaymentType,
): Promise<PaymentOrder> {
  return clientFetch<PaymentOrder>(ENDPOINTS.payment.byEstimate(estimateId), {
    method: 'POST',
    body: JSON.stringify({ type }),
  });
}

/** POST /payments/confirm - 결제 승인 (서버가 주문·금액을 대조하고 토스에 승인 요청) */
export function confirmPayment(
  input: ConfirmPaymentInput,
): Promise<ConfirmedPayment> {
  return clientFetch<ConfirmedPayment>(ENDPOINTS.payment.confirm, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
