// [레이아웃] 일반 유저 전용
import AuthGuard from '@/lib/providers/AuthGuard';

import CustomerProfileGuard from '@/components/customer/CustomerProfileGuard';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allow="customer">
      <CustomerProfileGuard>{children}</CustomerProfileGuard>
    </AuthGuard>
  );
}
