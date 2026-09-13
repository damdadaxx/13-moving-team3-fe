'use client';

import { useState } from 'react';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';
import IcVisibility from '@/assets/icons/ic_visibility.svg';

import Button from '@/components/ui/Button/Button';
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
  const [isPriceVisible, setIsPriceVisible] = useState(true);
  const [comment, setComment] = useState('');

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
        <Button disabled={!isValid} onClick={handleSubmit}>
          견적 보내기
        </Button>
      }
    >
      <div className="flex w-full flex-col gap-[20px] tablet:gap-[32px]">
        <div className="flex flex-col gap-[16px] tablet:gap-[20px]">
          <div className="flex items-center gap-[8px]">
            <span className="flex items-center gap-[2px] rounded-[4px] bg-orange-100 py-[2px] pr-[7px] pl-[4px] text-sm-semibold text-orange-400 tablet:gap-[4px] tablet:rounded-[6px] tablet:py-[4px] tablet:pl-[5px] tablet:text-md-semibold">
              <IcSolidBox className="size-[20px] shrink-0" />
              {moveType}
            </span>
            {isDesignatedRequest && (
              <span className="flex items-center gap-[2px] rounded-[4px] bg-red-100 py-[2px] pr-[7px] pl-[4px] text-sm-semibold text-red-200 tablet:gap-[4px] tablet:rounded-[6px] tablet:py-[4px] tablet:pl-[5px] tablet:text-md-semibold">
                <IcSolidDocument className="size-[20px] shrink-0" />
                지정 견적 요청
              </span>
            )}
          </div>

          <p className="text-xl-semibold text-black-300">
            {customerName} 고객님
          </p>

          <div className="flex flex-col gap-[8px] tablet:flex-row tablet:gap-[48px]">
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-md-regular text-gray-500">출발지</span>
                <span className="text-md-medium text-black-500 tablet:text-lg-medium">
                  {fromRegion}
                </span>
              </div>
              <IcArrowRight className="h-[23px] w-[17px] shrink-0" />
              <div className="flex items-center gap-[8px]">
                <span className="text-md-regular text-gray-500">도착지</span>
                <span className="text-md-medium text-black-500 tablet:text-lg-medium">
                  {toRegion}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-md-regular text-gray-500">이사일</span>
              <span className="text-md-medium text-black-500 tablet:text-lg-medium">
                {moveDate}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-line-100" />
        </div>

        <div className="flex flex-col gap-[16px]">
          <h3 className="text-lg-semibold text-black-300 tablet:text-2lg-semibold">
            견적가를 입력해 주세요
          </h3>
          <div className="flex items-center justify-between gap-[8px] rounded-[16px] border border-line-200 px-[14px] py-[14px] tablet:h-[54px] tablet:pr-[24px]">
            <input
              type={isPriceVisible ? 'text' : 'password'}
              inputMode="numeric"
              value={price}
              onChange={handlePriceChange}
              placeholder="견적가 입력"
              className="w-full text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none tablet:text-2lg-regular"
            />
            <button
              type="button"
              onClick={() => setIsPriceVisible((prev) => !prev)}
              aria-label={isPriceVisible ? '견적가 가리기' : '견적가 표시'}
              className="size-[24px] shrink-0"
            >
              <IcVisibility className="size-full" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <h3 className="text-lg-semibold text-black-300 tablet:text-2lg-semibold">
            코멘트를 입력해 주세요
          </h3>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="h-[160px] w-full resize-none rounded-[16px] border border-line-200 px-[16px] py-[14px] text-lg-regular text-black-500 placeholder:text-gray-400 focus:outline-none tablet:px-[24px] tablet:text-2lg-regular"
          />
        </div>
      </div>
    </Modal>
  );
}
