'use client';

import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/cn';

import Toast from '@/components/ui/Toast';

interface ToastItem {
  id: number;
  message: string;
}

export interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxCount?: number;
}

const DEFAULT_MAX_TOAST_COUNT = 3;

/*
@ ToastProvider
- 전역에서 showToast만 호출하면 토스트를 띄운다
- document.body 포탈로 렌더해서 body 기준으로 위치한다
- 여러 개는 위에서부터 스택으로 쌓이고, maxCount를 넘기면 오래된 것부터 제거한다
*/
export default function ToastProvider({
  children,
  maxCount = DEFAULT_MAX_TOAST_COUNT,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback(
    (message: string) => {
      idRef.current += 1;
      setToasts((prev) =>
        [{ id: idRef.current, message }, ...prev].slice(0, maxCount),
      );
    },
    [maxCount],
  );

  const closeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<ToastContextType>(() => ({ showToast }), [showToast]);

  const toastViewport =
    typeof document !== 'undefined' &&
    toasts.length > 0 &&
    createPortal(
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 top-[70px] z-toast flex flex-col items-center gap-[8px] px-[24px]',
          'tablet:top-[103px]',
        )}
      >
        {toasts.map((item) => (
          <div key={item.id} className="w-full pointer-events-auto">
            <Toast message={item.message} onClose={() => closeToast(item.id)} />
          </div>
        ))}
      </div>,
      document.body,
    );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toastViewport}
    </ToastContext.Provider>
  );
}
