// [메뉴] 내 견적 관리 메뉴 > 결제내역 탭메뉴
// 결제 1건 카드 (선수금/잔금, 금액, 결제일, 이사 정보). 카드를 누르면 견적 상세로 이동한다
'use client';

import { Link } from '@/i18n/navigation';
import type { PaymentHistoryItem } from '@/types/payment';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';

import { cn } from '@/utils/cn';
import getShortAddress from '@/utils/getShortAddress';

import EstimateCard from '@/components/ui/EstimateCard';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface PaymentHistoryCardProps {
  payment: PaymentHistoryItem;
}

export default function PaymentHistoryCard({
  payment,
}: PaymentHistoryCardProps) {
  const t = useTranslations('Payment');
  const tMover = useTranslations('MoverCard');
  const formatPrice = useFormatPrice();
  const formatDate = useFormatDate();
  const tagSize = useBreakpointValue('sm', 'md', 'md');
  const { estimate } = payment;

  return (
    <Link
      href={`${ROUTES.customerEstimates}/${estimate.estimateId}`}
      className="block"
    >
      <EstimateCard className="gap-[16px] transition-shadow hover:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.4),2px_2px_10px_0_rgba(220,220,220,0.4)] desktop:gap-[20px]">
        <div className="flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <ServiceTypeTag
              variant="service"
              serviceType={estimate.serviceType}
              size={tagSize}
            />
            <span className="rounded-full bg-orange-100 px-[10px] py-[4px] text-sm-semibold text-orange-400">
              {t(payment.type === 'DEPOSIT' ? 'typeDeposit' : 'typeBalance')}
            </span>
          </div>
          <span className="text-sm-medium text-gray-300 tablet:text-md-medium">
            {payment.paidAt ? formatDate(payment.paidAt, 'korean') : ''}
          </span>
        </div>

        <div className="flex items-end justify-between gap-[12px]">
          <div className="min-w-0">
            <p className="truncate text-lg-semibold text-black-300 tablet:text-2lg-semibold">
              {tMover('nickname', { nickname: estimate.mover.nickname })}
            </p>
            <p className="mt-[4px] break-words text-md-regular text-gray-400">
              {getShortAddress(estimate.departureAddress)}
              {' → '}
              {getShortAddress(estimate.arrivalAddress)}
            </p>
            <p className="text-sm-regular text-gray-300 tablet:text-md-regular">
              {t('moveDate', { date: formatDate(estimate.moveDate, 'usage') })}
            </p>
          </div>
          <p
            className={cn(
              'shrink-0 text-xl-bold text-black-400',
              'tablet:text-2xl-bold',
            )}
          >
            {formatPrice(payment.amount)}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line-200 pt-[12px] text-sm-regular text-gray-400 tablet:text-md-regular">
          <span>{t('estimatePrice')}</span>
          <span>{formatPrice(estimate.price)}</span>
        </div>
      </EstimateCard>
    </Link>
  );
}
