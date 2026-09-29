'use client';
import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useUpdateEstimateStatusMutation } from '@/hooks/queries/estimate/mutations';

import Button from '@/components/ui/Button/Button';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';

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
  const [rejectReason, setRejectReason] = useState('');
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const { showToast } = useToast();
  const updateEstimateStatusMutation = useUpdateEstimateStatusMutation();

  const isValid = rejectReason.length >= MIN_REASON_LENGTH;

  async function handleSubmit() {
    if (!isValid) return;

    if (!estimateId) {
      showToast('견적 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
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
        error instanceof HttpError
          ? error.message
          : '반려 처리에 실패했어요. 잠시 후 다시 시도해 주세요.';
      showToast(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="반려요청"
      variant="sheet"
      buttons={
        <Button
          size={controlSize}
          disabled={!isValid || updateEstimateStatusMutation.isPending}
          onClick={handleSubmit}
        >
          반려하기
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
          <Label variant="modal">반려 사유를 입력해 주세요</Label>
          <textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="h-[160px] w-full resize-none rounded-[16px] border border-line-200 px-[16px] py-[14px] text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none desktop:px-[24px] desktop:text-2lg-regular"
          />
        </div>
      </div>
    </Modal>
  );
}
