// 공용 모달 컴포넌트

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div>
      <button onClick={onClose}>닫기</button>
      {children}
    </div>
  );
}
