// tanstack/react-query - auth mutations
import type { AuthUser } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getMe, login, logout, signup } from '@/lib/api/auth';

import { authKeys } from '@/hooks/queries/auth/keys';

function useResetAuthCache() {
  const queryClient = useQueryClient();

  return (user: AuthUser | null) => {
    queryClient.setQueryData(authKeys.me(), user);
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== authKeys.all[0],
    });
  };
}

export function useLoginMutation() {
  const resetAuthCache = useResetAuthCache();

  return useMutation({
    mutationFn: login,
    onSuccess: resetAuthCache,
  });
}

export function useSignupMutation() {
  const resetAuthCache = useResetAuthCache();

  return useMutation({
    mutationFn: signup,
    onSuccess: resetAuthCache,
  });
}

export function useLogoutMutation() {
  const resetAuthCache = useResetAuthCache();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      resetAuthCache(null);
    },
  });
}

/*
@ 소셜 로그인 완료 후 세션 동기화
- 백엔드가 리다이렉트로 쿠키를 심기 때문에 응답 body 가 없다 → /auth/me 로 로그인 사용자를 다시 읽는다
- 로그인과 같은 캐시 초기화(resetAuthCache)를 적용한다
*/
export function useSyncSessionMutation() {
  const resetAuthCache = useResetAuthCache();

  return useMutation({
    mutationFn: getMe,
    onSuccess: resetAuthCache,
  });
}
