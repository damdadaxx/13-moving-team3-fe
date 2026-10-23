import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { HttpError } from '@/lib/api/errors';
import { fetchMoverAiSearch } from '@/lib/api/mover';
import { createMoverProfile, updateMoverProfile } from '@/lib/api/moverProfile';

import {
  setAiUsage,
  syncAiUsageOnError,
} from '@/hooks/features/ai/queries/queries';
import {
  moverKeys,
  moverProfileKeys,
} from '@/hooks/features/mover/queries/keys';

/** 공개 기사님 상세·목록은 프로필과 다른 캐시라, 수정 후 따로 비운다 */
function invalidatePublicMoverQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: [...moverKeys.all, 'detail'],
  });
  void queryClient.invalidateQueries({ queryKey: moverKeys.lists() });
}

export function useCreateMoverProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMoverProfile,
    onSuccess: (createdProfile) => {
      queryClient.setQueryData(moverProfileKeys.detail(), createdProfile);
      invalidatePublicMoverQueries(queryClient);
    },
    onError: async (error) => {
      if (error instanceof HttpError && error.status === 409) {
        await queryClient.invalidateQueries({
          queryKey: moverProfileKeys.detail(),
        });
      }
    },
  });
}

export function useUpdateMoverProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMoverProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(moverProfileKeys.detail(), updatedProfile);
      invalidatePublicMoverQueries(queryClient);
    },
  });
}

/*
@ 기사님 AI 검색 (자연어 → 목록 필터)
- Enter 를 누를 때 한 번 실행하는 동작이라 query 가 아니라 mutation 으로 둔다
- 결과 필터는 화면에서 URL 쿼리에 반영한다 → 기존 목록 쿼리가 다시 돈다
- 429(분당·하루 한도)는 다시 시도해도 실패하므로 재시도하지 않는다 (mutation 기본값이 재시도 없음)
*/
export function useMoverAiSearchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchMoverAiSearch,
    onSuccess: ({ usage }) => setAiUsage(queryClient, 'moverSearch', usage),
    onError: (error) => syncAiUsageOnError(queryClient, 'moverSearch', error),
  });
}
