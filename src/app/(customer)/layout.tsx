// [레이아웃] 일반 유저 전용
import AuthGuard from '@/lib/providers/AuthGuard';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allow="customer">{children}</AuthGuard>;
}
