'use client';

import { useEffect } from 'react';

import type { AuthVariant } from '@/types/role';
import { usePathname, useRouter } from 'next/navigation';

import {
  getHomePath,
  getSafeCallbackPath,
  getSigninPath,
} from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

/*
@ 라우트 그룹 인증 가드
- guest: (auth) 비로그인 전용. 로그인 사용자는 역할 home(또는 callbackUrl)으로
- customer / mover: 해당 역할 로그인 필요. 비로그인 → 역할별 signin, 다른 역할 → 본인 home
- (public)은 가드하지 않는다
*/
interface AuthGuardProps {
  children: React.ReactNode;
  allow: AuthVariant;
}

export default function AuthGuard({ children, allow }: AuthGuardProps) {
  const { isLoading, isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const canRender =
    !isLoading &&
    (allow === 'guest' ? !isLoggedIn : isLoggedIn && role === allow);

  useEffect(() => {
    if (isLoading) return;

    if (allow === 'guest') {
      if (isLoggedIn && role) {
        const callbackUrl = new URLSearchParams(window.location.search).get(
          'callbackUrl',
        );
        router.replace(getSafeCallbackPath(role, callbackUrl));
      }
      return;
    }

    if (!isLoggedIn) {
      const signinPath = getSigninPath(allow);
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`${signinPath}?callbackUrl=${callbackUrl}`);
      return;
    }

    if (role !== allow) {
      router.replace(getHomePath(role ?? allow));
    }
  }, [allow, isLoading, isLoggedIn, pathname, role, router]);

  if (!canRender) {
    return <LoadingDisplay />;
  }

  return children;
}
