// 인증 상태 전역 Provider
// GET /auth/me 로 세션을 읽고, 라우트 그룹 layout의 AuthGuard가 역할별 리다이렉트를 수행한다

'use client';

import { createContext, useMemo } from 'react';

import type {
  AuthUser,
  LoginInput,
  SignupInput,
  SocialLoginInput,
  SocialProvider,
} from '@/types/auth';
import type { Role } from '@/types/role';

import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useSocialLoginMutation,
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
  socialLogin: (
    provider: SocialProvider,
    input: SocialLoginInput,
  ) => Promise<AuthUser>;
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
  const socialLoginMutation = useSocialLoginMutation();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoggedIn: user !== null,
      isLoading,
      login: (input) => loginMutation.mutateAsync(input),
      signup: (input) => signupMutation.mutateAsync(input),
      logout: () => logoutMutation.mutateAsync(),
      socialLogin: (provider, input) =>
        socialLoginMutation.mutateAsync({ provider, ...input }),
    }),
    [
      user,
      isLoading,
      loginMutation,
      signupMutation,
      logoutMutation,
      socialLoginMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
