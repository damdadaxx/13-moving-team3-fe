// 토스 결제창에서 돌아온 결과 화면 (성공: 승인 요청 / 실패: 사유 안내)
'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import type { ConfirmedPayment } from '@/types/payment';
import { useTranslations } from 'next-intl';

import IcBadgeCheck from '@/assets/icons/ic_badge_check.svg';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useConfirmPaymentMutation } from '@/hooks/features/payment/queries/mutations';

import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

function getEstimatePath(estimateId?: string) {
  return estimateId
    ? `${ROUTES.customerEstimates}/${estimateId}`
    : ROUTES.customerEstimates;
}

/*
@ 승인 완료 결과 보관 (이 탭 sessionStorage)
- 성공 주소(paymentKey·orderId·amount가 붙은 URL)를 새로고침하면 같은 승인 요청이 다시 나간다.
  서버가 이미 처리한 건을 거절해도 실패 화면이 뜨지 않도록, 승인에 성공한 결과를 orderId로 보관해 두고
  같은 주소를 다시 열면 요청 없이 그 결과를 보여준다
*/
const CONFIRMED_KEY_PREFIX = 'moving-payment-confirmed-';

function readConfirmedRaw(orderId: string): string | null {
  try {
    return window.sessionStorage.getItem(CONFIRMED_KEY_PREFIX + orderId);
  } catch {
    return null;
  }
}

function parseConfirmed(raw: string | null): ConfirmedPayment | null {
  try {
    return raw ? (JSON.parse(raw) as ConfirmedPayment) : null;
  } catch {
    return null;
  }
}

// 보관한 값은 이 탭에서만 바뀌므로 구독할 것이 없다 (읽는 용도로만 useSyncExternalStore를 쓴다)
const subscribeNothing = () => () => {};

function writeConfirmed(orderId: string, payment: ConfirmedPayment) {
  try {
    window.sessionStorage.setItem(
      CONFIRMED_KEY_PREFIX + orderId,
      JSON.stringify(payment),
    );
  } catch {
    // 사파리 프라이빗 모드 등 storage가 막힌 경우엔 새로고침 때 다시 승인을 요청한다
  }
}

/** 결제 완료 화면 (에러 화면처럼 보이지 않게 체크 아이콘과 결제 요약을 보여준다) */
function PaymentSuccessView({ payment }: { payment: ConfirmedPayment }) {
  const t = useTranslations('Payment');
  const formatPrice = useFormatPrice();
  const formatDate = useFormatDate();

  const rows = [
    {
      label: t('summaryType'),
      value: t(payment.type === 'DEPOSIT' ? 'typeDeposit' : 'typeBalance'),
    },
    { label: t('summaryAmount'), value: formatPrice(payment.amount) },
    ...(payment.paidAt
      ? [
          {
            label: t('summaryPaidAt'),
            value: formatDate(payment.paidAt, 'korean'),
          },
        ]
      : []),
  ];

  return (
    <main className="flex min-h-[calc(100dvh-54px)] items-center justify-center px-[24px] py-[48px] desktop:min-h-[calc(100dvh-88px)]">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-[24px] text-center">
        <IcBadgeCheck aria-hidden className="size-[64px] text-orange-400" />

        <div className="flex flex-col gap-[8px]">
          <h1 className="text-2xl-bold text-black-400">{t('successTitle')}</h1>
          <p className="text-md-regular text-gray-400 tablet:text-lg-regular">
            {t(
              payment.type === 'DEPOSIT'
                ? 'successDepositGuide'
                : 'successBalanceGuide',
            )}
          </p>
        </div>

        <dl className="flex w-full flex-col gap-[12px] rounded-[16px] bg-gray-50 px-[20px] py-[20px] text-left">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-[12px]"
            >
              <dt className="text-md-regular text-gray-400">{row.label}</dt>
              <dd className="text-md-semibold text-black-400 tablet:text-lg-semibold">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex w-full flex-col gap-[8px] tablet:flex-row">
          <Button
            size="sm"
            variant="outlined"
            className="w-full tablet:flex-1"
            href={ROUTES.customerEstimatesPayments}
          >
            {t('viewHistory')}
          </Button>
          <Button
            size="sm"
            className="w-full tablet:flex-1"
            href={getEstimatePath(payment.estimateId)}
          >
            {t('viewEstimate')}
          </Button>
        </div>
      </div>
    </main>
  );
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
- 이미 승인에 성공한 주문의 주소를 다시 열면 요청 없이 보관한 결과를 보여준다
*/
export function PaymentSuccess({
  paymentKey,
  orderId,
  amount,
  estimateId,
}: PaymentSuccessProps) {
  const t = useTranslations('Payment');
  const confirm = useConfirmPaymentMutation();
  const hasRequestedRef = useRef(false);
  // 서버 렌더에는 보관값이 없어서 null이고, 클라이언트에서 sessionStorage를 읽는다
  const restoredRaw = useSyncExternalStore(
    subscribeNothing,
    () => (orderId ? readConfirmedRaw(orderId) : null),
    () => null,
  );
  const restored = parseConfirmed(restoredRaw);
  const amountValue = Number(amount);
  const isValidQuery =
    Boolean(paymentKey) && Boolean(orderId) && Number.isFinite(amountValue);

  const requestConfirm = () => {
    confirm.mutate(
      {
        paymentKey: paymentKey as string,
        orderId: orderId as string,
        amount: amountValue,
      },
      {
        onSuccess: (payment) => writeConfirmed(orderId as string, payment),
      },
    );
  };

  useEffect(() => {
    if (!isValidQuery || hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    // 이미 승인에 성공한 주문이면 요청하지 않는다 (화면은 restored로 보여준다)
    if (readConfirmedRaw(orderId as string)) return;

    requestConfirm();
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

  const payment = restored ?? (confirm.isSuccess ? confirm.data : null);
  if (payment) return <PaymentSuccessView payment={payment} />;

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
        onClick={requestConfirm}
      />
    ) : (
      <EmptyState
        message={message}
        buttonLabel={t('viewEstimate')}
        href={getEstimatePath(estimateId)}
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
