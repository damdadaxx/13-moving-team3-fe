'use client';
import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useUpdateEstimateStatusMutation } from '@/hooks/features/estimate/queries/mutations';

import Button from '@/components/ui/Button/Button';
import Label from '@/components/ui/Form/Label';
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

const MIN_REASON_LENGTH = 10;

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
  const [rejectReason, setRejectReason] = useState('');
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const { showToast } = useToast();
  const updateEstimateStatusMutation = useUpdateEstimateStatusMutation();

  const isValid = rejectReason.length >= MIN_REASON_LENGTH;

  async function handleSubmit() {
    if (!isValid) return;

    if (!estimateId) {
      showToast(t('estimateLoadFailed'));
      return;
    }

    try {
      await updateEstimateStatusMutation.mutateAsync({
        estimateId,
        input: { status: 'REJECTED', rejectReason },
      });
      setRejectReason('');
      onSuccess?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : t('rejectFailed');
      showToast(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('rejectTitle')}
      variant="sheet"
      buttons={
        <Button
          size={controlSize}
          disabled={!isValid || updateEstimateStatusMutation.isPending}
          onClick={handleSubmit}
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

        <div>
          <Label variant="modal">{t('rejectReasonLabel')}</Label>
          <textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder={t('minLengthPlaceholder')}
            className="h-[160px] w-full resize-none rounded-[16px] border border-line-200 px-[16px] py-[14px] text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none desktop:px-[24px] desktop:text-2lg-regular"
          />
        </div>
      </div>
    </Modal>
  );
}
