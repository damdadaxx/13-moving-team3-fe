// [레이아웃] 기사님 전용
import AuthGuard from '@/lib/providers/AuthGuard';

export default function MoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allow="mover">{children}</AuthGuard>;
}
