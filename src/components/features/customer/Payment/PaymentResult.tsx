// 토스 결제창에서 돌아온 결과 화면 (성공: 승인 요청 / 실패: 사유 안내)
'use client';

import { useEffect, useRef } from 'react';

import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useConfirmPaymentMutation } from '@/hooks/features/payment/queries/mutations';

import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

function getEstimatePath(estimateId?: string) {
  return estimateId
    ? `${ROUTES.customerEstimates}/${estimateId}`
    : ROUTES.customerEstimates;
}

interface PaymentSuccessProps {
  paymentKey?: string;
  orderId?: string;
  amount?: string;
  estimateId?: string;
}

/*
@ 결제 성공 (successUrl)
- 토스가 쿼리로 돌려준 paymentKey·orderId·amount를 서버 승인 API로 보낸다
- 금액 검증은 서버가 한다. 서버가 저장한 주문과 다르면 승인되지 않는다
- 개발 모드 Strict Mode에서 effect가 두 번 돌아도 승인 요청은 한 번만 보낸다
*/
export function PaymentSuccess({
  paymentKey,
  orderId,
  amount,
  estimateId,
}: PaymentSuccessProps) {
  const t = useTranslations('Payment');
  const formatPrice = useFormatPrice();
  const confirm = useConfirmPaymentMutation();
  const hasRequestedRef = useRef(false);
  const amountValue = Number(amount);
  const isValidQuery =
    Boolean(paymentKey) && Boolean(orderId) && Number.isFinite(amountValue);

  useEffect(() => {
    if (!isValidQuery || hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    confirm.mutate({
      paymentKey: paymentKey as string,
      orderId: orderId as string,
      amount: amountValue,
    });
    // confirm은 매 렌더 새 객체라 의존성에서 뺀다. 요청은 ref로 한 번만 보낸다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidQuery, paymentKey, orderId, amountValue]);

  if (!isValidQuery) {
    return (
      <EmptyState
        message={t('invalidResult')}
        buttonLabel={t('viewEstimate')}
        href={getEstimatePath(estimateId)}
      />
    );
  }

  if (confirm.isError) {
    const error = confirm.error;
    const message =
      error instanceof HttpError ? error.message : t('confirmFailed');
    // 토스 서버 오류·통신 실패(5xx, 네트워크)는 결제가 대기 상태로 남아 같은 승인 요청을 다시 보내도 된다
    // (서버가 orderId로 중복을 막는다). 거절·금액 불일치 같은 4xx는 다시 보내도 같아서 견적으로 돌려보낸다
    const isRetryable =
      !(error instanceof HttpError) ||
      error.status === undefined ||
      error.status >= 500;

    return isRetryable ? (
      <EmptyState
        message={message}
        buttonLabel={t('retry')}
        onClick={() =>
          confirm.mutate({
            paymentKey: paymentKey as string,
            orderId: orderId as string,
            amount: amountValue,
          })
        }
      />
    ) : (
      <EmptyState
        message={message}
        buttonLabel={t('viewEstimate')}
        href={getEstimatePath(estimateId)}
      />
    );
  }

  if (confirm.isSuccess) {
    const payment = confirm.data;
    return (
      <EmptyState
        message={t(
          payment.type === 'DEPOSIT' ? 'successDeposit' : 'successBalance',
          { amount: formatPrice(payment.amount) },
        )}
        buttonLabel={t('viewEstimate')}
        href={getEstimatePath(payment.estimateId)}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-54px)] flex-col items-center justify-center gap-[12px] desktop:min-h-[calc(100dvh-88px)]">
      <LoadingDisplay fullHeight={false} />
      <p className="text-md-regular text-gray-400">{t('confirming')}</p>
    </div>
  );
}

interface PaymentFailProps {
  message?: string;
  estimateId?: string;
}

/*
@ 결제 실패 (failUrl)
- 토스가 쿼리로 돌려준 message를 그대로 보여준다 (예: 한도 초과, 카드사 거절)
*/
export function PaymentFail({ message, estimateId }: PaymentFailProps) {
  const t = useTranslations('Payment');

  return (
    <EmptyState
      message={message || t('failDefault')}
      buttonLabel={t('backToEstimate')}
      href={getEstimatePath(estimateId)}
    />
  );
}
