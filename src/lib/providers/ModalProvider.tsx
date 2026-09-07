'use client';

import { createContext, useState } from 'react';

// Context로 공유할 값의 타입
export interface ModalContextType {
  isOpen: boolean;
  content: React.ReactNode;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

// Provider 외부에서 사용 시 null 체크를 강제하기 위해 null 유니온
export const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}

// Context 기반 모달 열림/닫힘 상태 관리
export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  function openModal(modalContent: React.ReactNode): void {
    setContent(modalContent);
    setIsOpen(true);
  }

  function closeModal(): void {
    setIsOpen(false);
    setContent(null);
  }

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      {content}
    </ModalContext.Provider>
  );
}
