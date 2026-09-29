// [레이아웃] 기사님 전용
import AuthGuard from '@/lib/providers/AuthGuard';

import MoverProfileGuard from '@/components/mover/MoverProfileGuard';

export default function MoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allow="mover">
      <MoverProfileGuard>{children}</MoverProfileGuard>
    </AuthGuard>
  );
}
