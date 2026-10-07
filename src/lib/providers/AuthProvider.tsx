// 인증 상태 전역 Provider
// GET /auth/me 로 세션을 읽고, 라우트 그룹 layout의 AuthGuard가 역할별 리다이렉트를 수행한다

'use client';

import { createContext, useEffect, useMemo } from 'react';

import type { AuthUser, LoginInput, SignupInput } from '@/types/auth';
import type { Role } from '@/types/role';

import { writeStoredAuthUser } from '@/lib/storage/authUserStorage';

import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useSyncSessionMutation,
} from '@/hooks/features/auth/queries/mutations';
import { useMeQuery } from '@/hooks/features/auth/queries/queries';

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

  /*
  @ 로그인 사용자 정보를 localStorage와 동기화
  - 로그인/회원가입/로그아웃/소셜 세션 동기화뿐 아니라, 새로고침 후 백그라운드로
    다시 확인한 결과(user가 바뀌거나 null로 떨어지는 경우)까지 한 곳에서 반영한다.
  - isLoading 중에는 건드리지 않는다 — 아직 로딩 중(initialData도 없는 진짜 첫 로드)
    인데 undefined/null로 먼저 지워버리면 깜빡임 방지 목적과 어긋난다.
  */
  useEffect(() => {
    if (isLoading) return;
    writeStoredAuthUser(user);
  }, [user, isLoading]);

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
