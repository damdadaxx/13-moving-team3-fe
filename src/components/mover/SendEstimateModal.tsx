'use client';

import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import {
  useCreateEstimateMutation,
  useUpdateEstimateStatusMutation,
} from '@/hooks/queries/estimate/mutations';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';

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

function formatPrice(rawDigits: string): string {
  if (!rawDigits) return '';
  return `${BigInt(rawDigits).toLocaleString('ko-KR')}원`;
}

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
    setPrice(formatPrice(event.target.value.replace(/[^0-9]/g, '')));
  }

  async function handleSubmit() {
    if (!isValid) return;

    if (isDesignated && !estimateId) {
      showToast('견적 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
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
        error instanceof HttpError
          ? error.message
          : '견적 전송에 실패했어요. 잠시 후 다시 시도해 주세요.';
      showToast(message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="견적 보내기"
      variant="sheet"
      buttons={
        <Button
          size={controlSize}
          disabled={!isValid || isPending}
          onClick={handleSubmit}
        >
          견적 보내기
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
          label="견적가를 입력해 주세요"
          labelVariant="modal"
          size={controlSize}
          inputMode="numeric"
          value={price}
          onChange={handlePriceChange}
          placeholder="견적가 입력"
        />

        <div>
          <Label variant="modal">코멘트를 입력해 주세요</Label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="h-[160px] w-full resize-none rounded-[16px] border border-line-200 px-[16px] py-[14px] text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none desktop:px-[24px] desktop:text-2lg-regular"
          />
        </div>
      </div>
    </Modal>
  );
}
