// tanstack/react-query - auth mutations
import type { AuthUser, SocialLoginInput, SocialProvider } from '@/types/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login, logout, signup, socialLogin } from '@/lib/api/auth';

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

export function useSocialLoginMutation() {
  const resetAuthCache = useResetAuthCache();

  return useMutation({
    mutationFn: ({
      provider,
      ...input
    }: SocialLoginInput & { provider: SocialProvider }) =>
      socialLogin(provider, input),
    onSuccess: resetAuthCache,
  });
}
