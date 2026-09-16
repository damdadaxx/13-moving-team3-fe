'use client';

// [게시용] 이번 브랜치는 퍼블리싱까지만 진행한다. API 연동 없이 UI 상태만 다룬다.
// SendEstimateModal 참고해서 구현. Figma: 반려요청 (node 1:11274)
import { useState } from 'react';

import type { ServiceType } from '@/types/serviceType';

import Button from '@/components/ui/Button/Button';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';

import EstimateRequestSummary from './EstimateRequestSummary';

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  isDesignated: boolean;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  /** 반려 버튼 클릭(유효성 통과) 후 호출된다 */
  onSuccess?: () => void;
}

const MIN_REASON_LENGTH = 10;

export default function RejectRequestModal({
  isOpen,
  onClose,
  serviceType,
  isDesignated,
  customerName,
  fromRegion,
  toRegion,
  moveDate,
  onSuccess,
}: RejectRequestModalProps) {
  const [rejectReason, setRejectReason] = useState('');

  const isValid = rejectReason.length >= MIN_REASON_LENGTH;

  function handleSubmit() {
    if (!isValid) return;

    setRejectReason('');
    onSuccess?.();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="반려요청"
      variant="sheet"
      buttons={
        <Button size="sm" disabled={!isValid} onClick={handleSubmit}>
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
