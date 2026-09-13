/*=================================================
공용 모달 컴포넌트 (Modal base)
=================================================*/

/*
@ 오버레이 (바깥 div)
- popup은 항상 items-center(수직 중앙), sheet는 모바일에서 items-end(하단 고정) → tablet: 이상에서 items-center로 전환
*/

/*
@ 카드 (안쪽 div)
- 공통: bg-gray-50, drop-shadow
- useOutsideClick: 카드 밖 클릭 또는 ESC 시 onClose
- max-h-[90vh] + overflow-hidden: 카드 높이를 화면 안으로 가두고, 스크롤은 children 영역에서만 발생
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
@ 하단 버튼 영역
- buttons로 액션 버튼을 받아 flex + gap-[8px]로 정렬한다 (버튼 1개면 gap은 보이지 않음)
- 사용: buttons: <> <Button /> <ButtonRoundedSquare /> </>
*/

/*
@ 사용 방식
- 도메인 컴포넌트에서 Modal을 직접 쓰기보다, ModalProvider가 최상위에서 한 번만 렌더링하고
  useModal()의 openModal(content, { title, variant, buttons }) / closeModal 로 전역에서 열고 닫는다
- children에 텍스트 한 줄짜리 확인 모달부터 폼이 들어간 복잡한 모달까지 자유롭게 구성
- 버튼이 폼 상태에 묶여 있으면 도메인 컴포넌트가 Modal을 직접 렌더하고 buttons로 넘긴다
*/

'use client';

import { useRef } from 'react';

import IcX from '@/assets/icons/ic_x.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

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
  buttons?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  variant = 'popup',
  buttons,
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dialogRef, onClose, {
    enabled: isOpen,
    closeOnEscape: true,
  });

  if (!isOpen) return null;

  const isSheet = variant === 'sheet';

  return (
    <div
      role="presentation"
      className={cn(
        'fixed inset-0 z-modal flex justify-center bg-black-500/50',
        isSheet ? 'items-end tablet:items-center' : 'items-center',
      )}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'flex max-h-[90vh] flex-col items-start overflow-hidden bg-gray-50 drop-shadow-[4px_4px_5px_rgba(169,169,169,0.2)]',
          isSheet
            ? 'w-full rounded-t-[32px] px-[24px] pt-[32px] pb-[40px]'
            : 'w-[292px] rounded-[24px] px-[16px] py-[24px]',
          'tablet:w-[608px] tablet:rounded-[32px] tablet:px-[24px] tablet:pt-[32px] tablet:pb-[40px]',
          className,
        )}
      >
        <div
          className={cn(
            'mb-[30px] flex w-full shrink-0 items-center justify-between',
            'tablet:mb-[40px]',
          )}
        >
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
            className="size-[24px] shrink-0 tablet:size-[36px] cursor-pointer"
          >
            <IcX className="size-full" />
          </button>
        </div>
        <div className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        {buttons && (
          <div
            className={cn(
              'mt-[24px] flex w-full shrink-0 items-center gap-[10px]',
              isSheet && 'mt-[32px]',
              // isFilter && 'mt-[26px]',
              'tablet:mt-[40px]',
            )}
          >
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
}
