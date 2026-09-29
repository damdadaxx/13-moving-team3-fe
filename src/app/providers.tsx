// 전역 Provider 조합
// QueryProvider, AuthProvider, ModalProvider, ToastProvider를 조합한다

'use client';

import AuthProvider from '@/lib/providers/AuthProvider';
import ModalProvider from '@/lib/providers/ModalProvider';
import QueryProvider from '@/lib/providers/QueryProvider';
import ToastProvider from '@/lib/providers/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <ToastProvider>{children}</ToastProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
