'use client';

// [게시용] 이번 브랜치는 퍼블리싱까지만 진행한다. API 연동 없이 UI 상태만 다룬다.
import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';

import EstimateRequestSummary from './EstimateRequestSummary';

interface SendEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDesignated: boolean;
  serviceType: ServiceType;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  /** 전송 버튼 클릭(유효성 통과) 후 호출된다 */
  onSuccess?: () => void;
}

const MIN_COMMENT_LENGTH = 10;

function formatPrice(rawDigits: string): string {
  if (!rawDigits) return '';
  return Number(rawDigits).toLocaleString('ko-KR');
}

export default function SendEstimateModal({
  isOpen,
  onClose,
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

  const isValid = price !== '' && comment.length >= MIN_COMMENT_LENGTH;

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPrice(formatPrice(event.target.value.replace(/[^0-9]/g, '')));
  }

  function handleSubmit() {
    if (!isValid) return;

    setPrice('');
    setComment('');
    onSuccess?.();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="견적 보내기"
      variant="sheet"
      buttons={
        <Button size={controlSize} disabled={!isValid} onClick={handleSubmit}>
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
