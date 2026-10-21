'use client';

import { useState } from 'react';

import { getPathname } from '@/i18n/navigation';
import type { PaymentType } from '@/types/payment';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useLocale } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import { useCreatePaymentOrderMutation } from '@/hooks/features/payment/queries/mutations';

/*
@ 토스페이먼츠 결제창 열기 (선수금 / 잔금)
- 순서: 서버에서 주문 생성(금액은 서버가 계산) → 토스 SDK 결제창 → 성공/실패 URL로 이동
- 성공하면 successUrl로 paymentKey·orderId·amount가 쿼리로 돌아오고, 승인(confirm)은 성공 페이지에서 한다
- 사용자가 결제창을 닫으면(USER_CANCEL) 오류로 보지 않고 조용히 끝낸다
- 클라이언트 키(NEXT_PUBLIC_TOSS_CLIENT_KEY)는 공개돼도 되는 값이다. 시크릿 키는 백엔드에만 둔다
*/

const USER_CANCEL_CODE = 'USER_CANCEL';

function isUserCancel(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === USER_CANCEL_CODE
  );
}

export function usePayEstimate(estimateId: string) {
  const locale = useLocale();
  const createOrder = useCreatePaymentOrderMutation(estimateId);
  const [isOpening, setIsOpening] = useState(false);

  /** 결제창을 연다. 실패하면 예외를 던지고, 사용자가 닫은 경우는 던지지 않는다 */
  async function pay(type: PaymentType) {
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.');
    }

    setIsOpening(true);
    try {
      const order = await createOrder.mutateAsync(type);
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: order.customerKey });

      const buildUrl = (href: string) =>
        `${window.location.origin}${getPathname({ locale, href })}?estimateId=${encodeURIComponent(estimateId)}`;

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: order.amount },
        orderId: order.orderId,
        orderName: order.orderName,
        customerName: order.customerName,
        successUrl: buildUrl(ROUTES.customerPaymentsSuccess),
        failUrl: buildUrl(ROUTES.customerPaymentsFail),
      });
    } catch (error) {
      if (!isUserCancel(error)) throw error;
    } finally {
      setIsOpening(false);
    }
  }

  return { pay, isOpening };
}
