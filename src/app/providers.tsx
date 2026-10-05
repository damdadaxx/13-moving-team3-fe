// 전역 Provider 조합
// QueryProvider, AuthProvider, ModalProvider, ToastProvider, PreviousPathRecorder를 조합한다

'use client';

import AuthProvider from '@/lib/providers/AuthProvider';
import CrossRoleAccessGuard from '@/lib/providers/CrossRoleAccessGuard';
import ModalProvider from '@/lib/providers/ModalProvider';
import PreviousPathRecorder from '@/lib/providers/PreviousPathRecorder';
import QueryProvider from '@/lib/providers/QueryProvider';
import ToastProvider from '@/lib/providers/ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <ToastProvider>
            <PreviousPathRecorder />
            <CrossRoleAccessGuard />
            {children}
          </ToastProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
