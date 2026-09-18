import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bulkDeleteLikes } from '@/lib/api/likes';

import { likeKeys } from '@/hooks/queries/likes/keys';

export function useBulkDeleteLikesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLikes,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: likeKeys.mine() });
    },
  });
}
