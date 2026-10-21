// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 > 견적 상세
// 선수금(견적가의 10%)·잔금 결제 현황과 결제 버튼
'use client';

import type { PaymentInfo } from '@/types/payment';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';

import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useToast } from '@/hooks/common/useToast';
import { useEstimatePaymentsQuery } from '@/hooks/features/payment/queries/queries';
import { usePayEstimate } from '@/hooks/features/payment/usePayEstimate';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import SectionTitle from '@/components/ui/SectionTitle';

interface PaymentSectionProps {
  estimateId: string;
}

/*
@ 결제 현황
- 선수금: 견적을 확정한 뒤 바로 결제한다 (견적가의 10%)
- 잔금: 이사가 끝난 뒤 "이사 확정"을 누르면서 결제한다 (나머지 90%)
- 어떤 버튼이 열리는지는 서버가 내려준 canPayDeposit / canPayBalance를 그대로 따른다
*/
export default function PaymentSection({ estimateId }: PaymentSectionProps) {
  const t = useTranslations('Payment');
  const formatPrice = useFormatPrice();
  const formatDate = useFormatDate();
  const { showToast } = useToast();
  const paymentsQuery = useEstimatePaymentsQuery(estimateId);
  const { pay, isOpening } = usePayEstimate(estimateId);

  if (paymentsQuery.isPending) return null;

  if (paymentsQuery.isError) {
    return (
      <p className="py-[20px] text-md-regular text-gray-400">
        {t('loadFailed')}
      </p>
    );
  }

  const payments = paymentsQuery.data;

  const handlePay = async (type: 'DEPOSIT' | 'BALANCE') => {
    try {
      await pay(type);
    } catch (error) {
      showToast(error instanceof HttpError ? error.message : t('payFailed'));
    }
  };

  const renderStatus = (info: PaymentInfo | null, canPay: boolean) => {
    if (info?.status === 'PAID') {
      return info.paidAt
        ? `${t('statusPaid')} · ${formatDate(info.paidAt, 'korean')}`
        : t('statusPaid');
    }
    if (info?.status === 'FAILED') return t('statusFailed');
    return canPay ? t('statusUnpaid') : t('statusWaiting');
  };

  const rows = [
    {
      key: 'deposit',
      label: t('depositLabel'),
      amount: payments.depositAmount,
      status: renderStatus(payments.deposit, payments.canPayDeposit),
      isPaid: payments.deposit?.status === 'PAID',
    },
    {
      key: 'balance',
      label: t('balanceLabel'),
      amount: payments.balanceAmount,
      status: renderStatus(payments.balance, payments.canPayBalance),
      isPaid: payments.balance?.status === 'PAID',
    },
  ];

  // 선수금은 냈지만 이사가 아직 끝나지 않아 잔금을 결제할 수 없는 상태
  const isWaitingForMove =
    payments.deposit?.status === 'PAID' &&
    !payments.canPayBalance &&
    !payments.isSettled;

  return (
    <div
      className={cn(
        'border-b border-line-100 py-[20px]',
        'tablet:py-[32px]',
        'desktop:border-b-0 desktop:py-[30px]',
      )}
    >
      <SectionTitle className={cn('mb-[20px]', 'tablet:mb-[28px]')}>
        {t('title')}
      </SectionTitle>

      <dl className="flex flex-col gap-[16px]">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-start justify-between gap-[12px]"
          >
            <div className="min-w-0">
              <dt className="text-lg-regular text-gray-300">{row.label}</dt>
              <dd
                className={cn(
                  'mt-[2px] text-sm-medium',
                  row.isPaid ? 'text-orange-400' : 'text-gray-300',
                )}
              >
                {row.status}
              </dd>
            </div>
            <dd className="shrink-0 text-lg-semibold text-black-400 tablet:text-xl-semibold">
              {formatPrice(row.amount)}
            </dd>
          </div>
        ))}
      </dl>

      {isWaitingForMove ? (
        <p className="mt-[16px] text-md-regular text-gray-400">
          {t('waitingMove')}
        </p>
      ) : null}
      {payments.isSettled ? (
        <p className="mt-[16px] text-md-medium text-orange-400">
          {t('settled')}
        </p>
      ) : null}

      {payments.canPayDeposit || payments.canPayBalance ? (
        <div className="mt-[20px] flex flex-col gap-[8px] tablet:flex-row">
          {payments.canPayDeposit ? (
            <Button
              size="sm"
              className="w-full tablet:w-auto"
              isLoading={isOpening}
              onClick={() => void handlePay('DEPOSIT')}
            >
              {t('payDeposit')}
            </Button>
          ) : null}
          {payments.canPayBalance ? (
            <Button
              size="sm"
              className="w-full tablet:w-auto"
              isLoading={isOpening}
              onClick={() => void handlePay('BALANCE')}
            >
              {t('payBalance')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
