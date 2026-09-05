// 전역 Provider 조합
// QueryProvider, AuthProvider, ModalProvider 컴포넌트를 조합하여 전역 Provider를 설정

'use client';

import AuthProvider from '@/lib/providers/AuthProvider';
import ModalProvider from '@/lib/providers/ModalProvider';
import QueryProvider from '@/lib/providers/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>{children}</ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
