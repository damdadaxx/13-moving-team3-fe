// tanstack/react-query - auth mutations
import type { AuthUser } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getMe,
  login,
  logout,
  signup,
  updateMe,
  updatePassword,
} from '@/lib/api/auth';

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

/*=================================================
회원정보 수정 Mutation
=================================================*/

/*
@ 이름·전화번호 수정
- 수정된 PublicUser를 authKeys.me 캐시에 바로 저장한다.
- AuthProvider와 Header가 같은 캐시를 사용하므로 추가 GET 없이 이름 변경이 즉시 반영된다.
- 로그인/로그아웃용 resetAuthCache는 다른 도메인 Query까지 제거하므로 여기서는 사용하지 않는다.
*/
export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
}

/*
@ 비밀번호 수정
- 성공 응답에 사용자 정보가 없고 이름·역할도 바뀌지 않으므로 Auth 캐시는 유지한다.
*/
export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: updatePassword,
  });
}
