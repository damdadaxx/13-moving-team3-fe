import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/lib/api/errors';
import { createMoverProfile, updateMoverProfile } from '@/lib/api/moverProfile';

import { moverProfileKeys } from '@/hooks/queries/moverProfile/keys';

export function useCreateMoverProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMoverProfile,
    onSuccess: (createdProfile) => {
      queryClient.setQueryData(moverProfileKeys.detail(), createdProfile);
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
    },
  });
}
