'use client';

import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useToast } from '@/hooks/common/useToast';
import {
  useCreateEstimateMutation,
  useUpdateEstimateStatusMutation,
} from '@/hooks/features/estimate/queries/mutations';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal';

import EstimateRequestSummary from './EstimateRequestSummary';

interface SendEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimateRequestId: string;
  /** 지정 건일 때만 있다. PATCH /estimates/{estimateId}에 필요하다 */
  estimateId?: string;
  isDesignated: boolean;
  serviceType: ServiceType;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  /** 전송 성공 후 호출된다 */
  onSuccess?: () => void;
}

const MIN_COMMENT_LENGTH = 10;

export default function SendEstimateModal({
  isOpen,
  onClose,
  estimateRequestId,
  estimateId,
  isDesignated,
  serviceType,
  customerName,
  fromRegion,
  toRegion,
  moveDate,
  onSuccess,
}: SendEstimateModalProps) {
  const t = useTranslations('MoverRequests');
  const formatPrice = useFormatPrice();
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const { showToast } = useToast();
  const createEstimateMutation = useCreateEstimateMutation();
  const updateEstimateStatusMutation = useUpdateEstimateStatusMutation();
  const isPending =
    createEstimateMutation.isPending || updateEstimateStatusMutation.isPending;

  const isValid = price !== '' && comment.length >= MIN_COMMENT_LENGTH;

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    /* 입력값은 숫자만 남겨 현재 언어 금액 표기로 보여준다 (ko: 180,000원 / en: ₩180,000) */
    const rawDigits = event.target.value.replace(/[^0-9]/g, '');
    setPrice(rawDigits ? formatPrice(Number(rawDigits)) : '');
  }

  async function handleSubmit() {
    if (!isValid) return;

    if (isDesignated && !estimateId) {
      showToast(t('estimateLoadFailed'));
      return;
    }

    try {
      if (isDesignated && estimateId) {
        await updateEstimateStatusMutation.mutateAsync({
          estimateId,
          input: {
            status: 'PROPOSED',
            price: Number(price.replace(/[^0-9]/g, '')),
            comment,
          },
        });
      } else {
        await createEstimateMutation.mutateAsync({
          estimateRequestId,
          price: Number(price.replace(/[^0-9]/g, '')),
          comment,
        });
      }
      setPrice('');
      setComment('');
      onSuccess?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : t('sendFailed');
      showToast(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('sendEstimate')}
      variant="sheet"
      buttons={
        <Button
          size={controlSize}
          disabled={!isValid || isPending}
          onClick={handleSubmit}
        >
          {t('sendEstimate')}
        </Button>
      }
    >
      <div className="flex w-full flex-col gap-[20px] desktop:gap-[32px]">
        <EstimateRequestSummary
          serviceType={serviceType}
          isDesignated={isDesignated}
          customerName={customerName}
          fromRegion={fromRegion}
          toRegion={toRegion}
          moveDate={moveDate}
        />

        <Input
          label={t('priceLabel')}
          labelVariant="modal"
          size={controlSize}
          inputMode="numeric"
          value={price}
          onChange={handlePriceChange}
          placeholder={t('pricePlaceholder')}
        />

        <div>
          <Label variant="modal">{t('commentLabel')}</Label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={t('minLengthPlaceholder')}
            className="h-[160px] w-full resize-none rounded-[16px] border border-line-200 px-[16px] py-[14px] text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none desktop:px-[24px] desktop:text-2lg-regular"
          />
        </div>
      </div>
    </Modal>
  );
}
