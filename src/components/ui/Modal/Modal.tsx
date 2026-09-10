// 공용 모달 컴포넌트
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
          'flex flex-col items-start bg-gray-50 drop-shadow-[4px_4px_5px_rgba(169,169,169,0.2)]',
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
