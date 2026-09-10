// [메뉴] 예시
// [페이지] Modal UI
'use client';

import { useModal } from '@/hooks/modal/useModal';

import Button from '@/components/ui/Button/Button';

export default function ModalExamplePage() {
  const { openModal, closeModal } = useModal();

  function handleOpenPopup() {
    openModal(
      <>
        <p className="text-2lg-medium text-black-300">
          일반 견적 요청을 먼저 진행해 주세요.
        </p>
        <Button onClick={closeModal}>일반 견적 요청 하기</Button>
      </>,
      { title: '지정 견적 요청하기', variant: 'popup' },
    );
  }

  function handleOpenSheet() {
    openModal(
      <>
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-lg-semibold text-black-400">이사 유형</h3>
          <div className="flex gap-[12px]">
            <span className="rounded-full border border-primary-400 bg-primary-100 px-[12px] py-[6px] text-md-medium text-primary-400">
              소형이사
            </span>
            <span className="rounded-full border border-gray-300 bg-background-100 px-[12px] py-[6px] text-md-medium text-black-400">
              사무실이사
            </span>
          </div>
        </div>
        <Button onClick={closeModal}>조회하기</Button>
      </>,
      { title: '필터', variant: 'sheet' },
    );
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
    </div>
  );
}
