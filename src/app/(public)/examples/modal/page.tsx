'use client';

import { useState } from 'react';

import { useModal } from '@/hooks/modal/useModal';

import SendEstimateModal from '@/components/mover/SendEstimateModal';
import Button from '@/components/ui/Button/Button';

export default function ModalExamplePage() {
  const { openModal, closeModal } = useModal();
  const [isSendQuoteOpen, setIsSendQuoteOpen] = useState(false);

  function handleOpenPopup() {
    openModal(
      <p className="text-2lg-medium text-black-300">
        일반 견적 요청을 먼저 진행해 주세요.
      </p>,
      {
        title: '지정 견적 요청하기',
        variant: 'popup',
        buttons: (
          <>
            <Button onClick={closeModal}>취소</Button>
            <Button onClick={closeModal}>일반 견적 요청 하기</Button>
          </>
        ),
      },
    );
  }

  function handleOpenSheet() {
    openModal(
      <div className="flex flex-col gap-[8px]">
        <h3 className="text-lg-semibold text-black-400">이사 유형</h3>
        <div className="flex gap-[12px]">
          <span className="rounded-full border border-orange-400 bg-orange-100 px-[12px] py-[6px] text-md-medium text-orange-400">
            소형이사
          </span>
          <span className="rounded-full border border-gray-300 bg-background-100 px-[12px] py-[6px] text-md-medium text-black-400">
            사무실이사
          </span>
        </div>
      </div>,
      {
        title: '필터',
        variant: 'sheet',
        buttons: <Button onClick={closeModal}>조회하기</Button>,
      },
    );
  }

  function handleOpenSendQuote() {
    setIsSendQuoteOpen(true);
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <h1 className="text-xl-bold">Modal 예시</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">popup (지정 견적 요청 확인)</h2>
        <Button onClick={handleOpenPopup}>모달 열기</Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">sheet (필터, 모바일에서 하단 시트)</h2>
        <Button onClick={handleOpenSheet}>모달 열기</Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">sheet (견적 보내기, 기사님 전용)</h2>
        <Button onClick={handleOpenSendQuote}>모달 열기</Button>
      </section>

      <SendEstimateModal
        isOpen={isSendQuoteOpen}
        onClose={() => setIsSendQuoteOpen(false)}
        moveType="소형이사"
        isDesignatedRequest
        customerName="김인서"
        fromRegion="서울시 중구"
        toRegion="경기도 수원시"
        moveDate="2024년 07월 01일 (월)"
      />
    </div>
  );
}
