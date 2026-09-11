/*=================================================
공용 모달 컴포넌트 (Modal base)
=================================================*/

/*
@ 오버레이 (바깥 div)
- 클릭하면 onClose 실행 (배경 클릭으로 닫기), ESC 키도 동일하게 닫음
- popup은 항상 items-center(수직 중앙), sheet는 모바일에서 items-end(하단 고정) → tablet: 이상에서 items-center로 전환
*/

/*
@ 카드 (안쪽 div)
- 공통: bg-gray-50, drop-shadow, 카드 클릭 시 stopPropagation으로 오버레이 닫힘 방지
- max-h-[90vh] + overflow-y-auto: 견적 보내기처럼 내용이 긴 모달이 짧은 화면에서 잘리지 않고 카드 내부에서 스크롤되게 함
- popup(모바일): w-[292px] 고정폭 + 전체 모서리 rounded-[24px] + px-16 py-24 gap-30 (예: 지정 견적 요청 확인)
- sheet(모바일): w-full 풀폭 + 위쪽 모서리만 rounded-t-[32px] + px-24 pt-32 pb-40 gap-40, 화면 하단에 붙는 바텀시트 (예: 견적 보내기, 필터)
- tablet: 이상에서는 variant 상관없이 w-[608px] / rounded-[32px](전체) / px-24 pt-32 pb-40 gap-40 로 수렴
*/

/*
@ 헤더 (제목 + 닫기 아이콘)
- variant와 무관하게 공통 레이아웃
- 텍스트: 모바일 text-2lg-bold(18px) → tablet: text-2xl-semibold(24px)
- 닫기 아이콘(ic_x.svg): 모바일 24px → tablet: 36px
*/

/*
@ 사용 방식
- 도메인 컴포넌트에서 Modal을 직접 쓰기보다, ModalProvider가 최상위에서 한 번만 렌더링하고
  useModal()의 openModal(content, { title, variant }) / closeModal 로 전역에서 열고 닫는다
- children에 텍스트 한 줄짜리 확인 모달부터 폼이 들어간 복잡한 모달까지 자유롭게 구성
*/

'use client';

import { useEffect } from 'react';

import IcX from '@/assets/icons/ic_x.svg';

import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /**
   * popup: 모바일에서도 중앙에 뜨는 고정폭 팝업 (예: 지정 견적 요청 확인)
   * sheet: 모바일에서 화면 하단에 붙는 바텀시트, 태블릿 이상에서는 popup과 동일한 중앙 팝업 (예: 견적 보내기, 필터)
   */
  variant?: 'popup' | 'sheet';
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  variant = 'popup',
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSheet = variant === 'sheet';

  return (
    <div
      role="presentation"
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-modal flex justify-center bg-black-500/40',
        isSheet ? 'items-end tablet:items-center' : 'items-center',
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'flex max-h-[90vh] flex-col items-start overflow-y-auto bg-gray-50 drop-shadow-[4px_4px_5px_rgba(169,169,169,0.2)]',
          isSheet
            ? 'w-full gap-[40px] rounded-t-[32px] px-[24px] pt-[32px] pb-[40px]'
            : 'w-[292px] gap-[30px] rounded-[24px] px-[16px] py-[24px]',
          'tablet:w-[608px] tablet:gap-[40px] tablet:rounded-[32px] tablet:px-[24px] tablet:pt-[32px] tablet:pb-[40px]',
          className,
        )}
      >
        <div className="flex w-full items-center justify-between">
          <h2
            id="modal-title"
            className="text-2lg-bold tablet:text-2xl-semibold text-black-400"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="size-[24px] shrink-0 tablet:size-[36px]"
          >
            <IcX className="size-full" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
