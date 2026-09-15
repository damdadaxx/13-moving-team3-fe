/*=================================================
공용 모달 컴포넌트 (Modal base)
=================================================*/

/*
@ 오버레이 (바깥 div)
- popup은 항상 items-center(수직 중앙), sheet는 모바일에서만 items-end(하단 고정) → tablet: 이상부터 items-center로 전환
*/

/*
@ 카드 (안쪽 div)
- 공통: bg-gray-50, drop-shadow
- useOutsideClick: 카드 밖 클릭 또는 ESC 시 onClose
- max-h-[90vh] + overflow-hidden: 카드 높이를 화면 안으로 가두고, 스크롤은 children 영역에서만 발생
- popup과 sheet는 sm→md 크기 전환 시점(브레이크포인트)이 서로 다르다 (Figma 실측 기준)
  - popup: 모바일 sm은 고정폭이 아니라 컨텐츠에 맞춰 폭이 정해지는 w-fit (Figma가 헤더 260px를 기준으로
    hug하는 구조라, children 쪽에 whitespace-nowrap을 주면 그 텍스트 폭까지 카드가 넓어진다)
    → tablet(744px)부터 바로 md(w-608) 고정폭으로 커짐 (예: 지정 견적 요청 확인)
  - sheet: 모바일 sm(w-full 바텀시트) → tablet부터는 모양만 중앙 팝업(w-375, 전체 둥근 모서리)으로 바뀌고
    내용 크기는 sm 그대로 유지 → desktop(1024px)부터 md(w-608)로 커짐 (예: 견적 보내기, 필터)
- popup: 전체 모서리 rounded-[24px](sm) → rounded-[32px](md) + px-16 py-24(sm) → px-24 pt-32 pb-40(md)
- sheet: 위쪽 모서리만 rounded-t-[32px](모바일) → 전체 rounded-[32px](tablet~) / 패딩(px-24 pt-32 pb-40)은 전 구간 동일
*/

/*
@ 헤더 (제목 + 닫기 아이콘)
- variant와 무관하게 공통 레이아웃, 다만 sm→md 전환 시점은 카드와 동일하게 variant별로 다르다
- 텍스트: sm text-2lg-bold(18px) → md text-2xl-semibold(24px) (popup은 tablet부터, sheet는 desktop부터)
- 닫기 아이콘(ic_x.svg): sm 24px → md 36px (동일 기준)
*/

/*
@ 하단 버튼 영역
- buttons로 액션 버튼을 받아 flex + gap-[8px]로 정렬한다 (버튼 1개면 gap은 보이지 않음)
- 사용: buttons: <> <Button /> <Button /> </>
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
   * popup: 모바일에서도 중앙에 뜨는 팝업. 폭은 컨텐츠에 맞춰 정해지므로(w-fit) 한 줄로 보여줄
   *   텍스트에는 whitespace-nowrap을 줘야 의도한 폭이 나온다. tablet부터 w-608 고정폭으로 전환 (예: 지정 견적 요청 확인)
   * sheet: 모바일에서 화면 하단에 붙는 바텀시트 → tablet부터 중앙 팝업으로 전환되지만 내용 크기는
   *   그대로 유지되다가 desktop부터 큰 사이즈로 전환 (예: 견적 보내기, 필터)
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
            ? 'w-full rounded-t-[32px] px-[24px] pt-[32px] pb-[40px] tablet:w-[375px] tablet:rounded-[32px] desktop:w-[608px]'
            : 'w-fit max-w-[calc(100vw-32px)] rounded-[24px] px-[16px] py-[24px] tablet:w-[608px] tablet:max-w-none tablet:rounded-[32px] tablet:px-[24px] tablet:pt-[32px] tablet:pb-[40px]',
          className,
        )}
      >
        <div
          className={cn(
            'mb-[30px] flex w-full shrink-0 items-center justify-between',
            isSheet ? 'desktop:mb-[40px]' : 'tablet:mb-[40px]',
          )}
        >
          <h2
            id="modal-title"
            className={cn(
              'text-2lg-bold text-black-400',
              isSheet
                ? 'desktop:text-2xl-semibold'
                : 'tablet:text-2xl-semibold',
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={cn(
              'size-[24px] shrink-0 cursor-pointer',
              isSheet ? 'desktop:size-[36px]' : 'tablet:size-[36px]',
            )}
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
              'mt-[24px] flex w-full shrink-0 items-center gap-[8px]',
              isSheet ? 'mt-[32px] desktop:mt-[40px]' : 'tablet:mt-[40px]',
            )}
          >
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
}
