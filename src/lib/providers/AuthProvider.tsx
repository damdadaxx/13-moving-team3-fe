// 인증 상태 전역 Provider
// GET /auth/me 로 세션을 읽고, 라우트 그룹 layout의 AuthGuard가 역할별 리다이렉트를 수행한다

'use client';

import { createContext, useMemo } from 'react';

import type { AuthUser, LoginInput, SignupInput } from '@/types/auth';
import type { Role } from '@/types/role';

import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useSyncSessionMutation,
} from '@/hooks/queries/auth/mutations';
import { useMeQuery } from '@/hooks/queries/auth/queries';

export interface AuthContextValue {
  user: AuthUser | null;
  role: Role | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** 소셜 로그인 리다이렉트 후 쿠키 기준으로 로그인 사용자를 다시 읽는다 */
  syncSession: () => Promise<AuthUser | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user = null, isLoading } = useMeQuery();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const logoutMutation = useLogoutMutation();
  const syncSessionMutation = useSyncSessionMutation();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoggedIn: user !== null,
      isLoading,
      login: (input) => loginMutation.mutateAsync(input),
      signup: (input) => signupMutation.mutateAsync(input),
      logout: () => logoutMutation.mutateAsync(),
      syncSession: () => syncSessionMutation.mutateAsync(),
    }),
    [
      user,
      isLoading,
      loginMutation,
      signupMutation,
      logoutMutation,
      syncSessionMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
