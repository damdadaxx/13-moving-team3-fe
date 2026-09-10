// 모달 open/close 상태 훅
import { useContext } from 'react';

import { ModalContext } from '@/lib/providers/ModalProvider';

/*
@ useModal
- ModalProvider 하위에서 openModal(content, options) / closeModal 로 모달을 제어한다.
- options.variant: 'popup'(기본, 중앙 팝업) | 'sheet'(모바일 바텀시트, 태블릿 이상은 popup과 동일)

@example
const { openModal, closeModal } = useModal();
openModal(<p>내용</p>, { title: '제목', variant: 'sheet' });
*/
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal은 ModalProvider 안에서 사용해야 합니다.');
  }

  return context;
}
