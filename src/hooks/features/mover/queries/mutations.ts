import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { HttpError } from '@/lib/api/errors';
import { createMoverProfile, updateMoverProfile } from '@/lib/api/moverProfile';

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
