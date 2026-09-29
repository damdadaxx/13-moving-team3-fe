// [레이아웃] 비로그인 전용 (signin / signup)
import AuthGuard from '@/lib/providers/AuthGuard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allow="guest">{children}</AuthGuard>;
}
