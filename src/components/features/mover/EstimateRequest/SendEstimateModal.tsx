'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { ServiceType } from '@/types/serviceType';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import {
  MESSAGE_TEXT_MIN_LENGTH,
  messageTextSchema,
} from '@/lib/validations/messageTextValidation';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatPrice } from '@/hooks/common/useFormatPrice';
import { useToast } from '@/hooks/common/useToast';
import {
  useCreateEstimateMutation,
  useUpdateEstimateStatusMutation,
} from '@/hooks/features/estimate/queries/mutations';

import Button from '@/components/ui/Button/Button';
import FormTextarea from '@/components/ui/Form/FormTextarea';
import Input from '@/components/ui/Form/Input';
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

const estimateFormSchema = z.object({ comment: messageTextSchema });
type EstimateFormValues = z.infer<typeof estimateFormSchema>;

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
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid: isCommentValid },
  } = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateFormSchema),
    mode: 'onTouched',
    defaultValues: { comment: '' },
  });
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const { showToast } = useToast();
  const createEstimateMutation = useCreateEstimateMutation();
  const updateEstimateStatusMutation = useUpdateEstimateStatusMutation();
  const isPending =
    createEstimateMutation.isPending || updateEstimateStatusMutation.isPending;

  const isValid = price !== '' && isCommentValid;

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    /* 입력값은 숫자만 남겨 현재 언어 금액 표기로 보여준다 (ko: 180,000원 / en: ₩180,000) */
    const rawDigits = event.target.value.replace(/[^0-9]/g, '');
    setPrice(rawDigits ? formatPrice(Number(rawDigits)) : '');
  }

  async function onSubmit({ comment }: EstimateFormValues) {
    if (price === '') return;

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
      reset();
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
          onClick={handleSubmit(onSubmit)}
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

        <FormTextarea
          control={control}
          name="comment"
          label={t('commentLabel')}
          labelVariant="modal"
          placeholder={t('minLengthPlaceholder')}
          minLength={MESSAGE_TEXT_MIN_LENGTH}
        />
      </div>
    </Modal>
  );
}
