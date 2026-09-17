'use client';

import { useState } from 'react';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal/Modal';

interface SendEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveType: string;
  isDesignatedRequest?: boolean;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  onSubmit?: (data: { price: string; comment: string }) => void;
}

const MIN_COMMENT_LENGTH = 10;

function formatPrice(rawDigits: string): string {
  if (!rawDigits) return '';
  return Number(rawDigits).toLocaleString('ko-KR');
}

export default function SendEstimateModal({
  isOpen,
  onClose,
  moveType,
  isDesignatedRequest = false,
  customerName,
  fromRegion,
  toRegion,
  moveDate,
  onSubmit,
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
    onSubmit?.({ price, comment });
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
        <div className="flex flex-col gap-[16px] desktop:gap-[20px]">
          <div className="flex items-center gap-[8px]">
            <span className="flex items-center gap-[2px] rounded-[4px] bg-orange-100 py-[2px] pr-[7px] pl-[4px] text-sm-semibold text-orange-400 desktop:gap-[4px] desktop:rounded-[6px] desktop:py-[4px] desktop:pl-[5px] desktop:text-md-semibold">
              <IcSolidBox className="size-[20px] shrink-0" />
              {moveType}
            </span>
            {isDesignatedRequest && (
              <span className="flex items-center gap-[2px] rounded-[4px] bg-red-100 py-[2px] pr-[7px] pl-[4px] text-sm-semibold text-red-200 desktop:gap-[4px] desktop:rounded-[6px] desktop:py-[4px] desktop:pl-[5px] desktop:text-md-semibold">
                <IcSolidDocument className="size-[20px] shrink-0" />
                지정 견적 요청
              </span>
            )}
          </div>

          <p className="text-xl-semibold text-black-300">
            {customerName} 고객님
          </p>

          <div className="flex flex-col gap-[8px] desktop:flex-row desktop:gap-[48px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-md-regular text-gray-500">출발지</span>
                <span className="text-md-medium text-black-500 desktop:text-lg-medium">
                  {fromRegion}
                </span>
              </div>
              <IcArrowRight className="h-[23px] w-[17px] shrink-0" />
              <div className="flex items-center gap-[8px]">
                <span className="text-md-regular text-gray-500">도착지</span>
                <span className="text-md-medium text-black-500 desktop:text-lg-medium">
                  {toRegion}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-md-regular text-gray-500">이사일</span>
              <span className="text-md-medium text-black-500 desktop:text-lg-medium">
                {moveDate}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-line-100" />
        </div>

        <Input
          label="견적가를 입력해 주세요"
          labelVariant="modal"
          size={controlSize}
          type="password"
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
