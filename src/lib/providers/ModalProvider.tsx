'use client';

import { createContext, useState } from 'react';

import Modal from '@/components/ui/Modal/Modal';

/*
@ ModalProvider
- 모달 상태를 전역으로 관리해 어느 컴포넌트에서든 useModal()로 열고 닫을 수 있게 한다.
- Modal은 Provider 최상위에서 한 번만 렌더링되어 z-index/overflow 이슈를 피한다.
*/

export interface ModalOptions {
  title: string;
  variant?: 'popup' | 'sheet';
}

export interface ModalContextType {
  isOpen: boolean;
  openModal: (content: React.ReactNode, options: ModalOptions) => void;
  closeModal: () => void;
}

// Provider 외부에서 사용 시 null 체크를 강제하기 위해 null 유니온
export const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [options, setOptions] = useState<ModalOptions>({ title: '' });

  function openModal(
    modalContent: React.ReactNode,
    modalOptions: ModalOptions,
  ): void {
    setContent(modalContent);
    setOptions(modalOptions);
    setIsOpen(true);
  }

  function closeModal(): void {
    setIsOpen(false);
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={options.title}
        variant={options.variant}
      >
        {content}
      </Modal>
    </ModalContext.Provider>
  );
}
