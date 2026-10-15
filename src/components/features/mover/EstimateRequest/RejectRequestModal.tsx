'use client';
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
import { useToast } from '@/hooks/common/useToast';
import { useUpdateEstimateStatusMutation } from '@/hooks/features/estimate/queries/mutations';

import Button from '@/components/ui/Button/Button';
import FormTextarea from '@/components/ui/Form/FormTextarea';
import Modal from '@/components/ui/Modal';

import EstimateRequestSummary from './EstimateRequestSummary';

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 지정 건의 estimateId. PATCH /estimates/{estimateId}에 필요하다 */
  estimateId?: string;
  serviceType: ServiceType;
  isDesignated: boolean;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  /** 반려 성공 후 호출된다 */
  onSuccess?: () => void;
}

const rejectFormSchema = z.object({ rejectReason: messageTextSchema });
type RejectFormValues = z.infer<typeof rejectFormSchema>;

export default function RejectRequestModal({
  isOpen,
  onClose,
  estimateId,
  serviceType,
  isDesignated,
  customerName,
  fromRegion,
  toRegion,
  moveDate,
  onSuccess,
}: RejectRequestModalProps) {
  const t = useTranslations('MoverRequests');
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    mode: 'onTouched',
    defaultValues: { rejectReason: '' },
  });
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const { showToast } = useToast();
  const updateEstimateStatusMutation = useUpdateEstimateStatusMutation();

  // 모달은 마운트된 채 열고 닫히므로, 닫을 때(X·배경·ESC 포함) 입력값을 비운다
  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit({ rejectReason }: RejectFormValues) {
    if (!estimateId) {
      showToast(t('estimateLoadFailed'));
      return;
    }

    try {
      await updateEstimateStatusMutation.mutateAsync({
        estimateId,
        input: { status: 'REJECTED', rejectReason },
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : t('rejectFailed');
      showToast(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('rejectTitle')}
      variant="sheet"
      buttons={
        <Button
          size={controlSize}
          disabled={!isValid || updateEstimateStatusMutation.isPending}
          onClick={handleSubmit(onSubmit)}
        >
          {t('reject')}
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

        <FormTextarea
          control={control}
          name="rejectReason"
          label={t('rejectReasonLabel')}
          labelVariant="modal"
          placeholder={t('minLengthPlaceholder')}
          minLength={MESSAGE_TEXT_MIN_LENGTH}
        />
      </div>
    </Modal>
  );
}
