// tanstack/react-query - estimate mutations
import type { UpdateEstimateStatusInput } from '@/types/estimate';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEstimate, updateEstimateStatus } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

export function useCreateEstimateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEstimate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estimateKeys.all });
    },
  });
}

export function useUpdateEstimateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      estimateId,
      input,
    }: {
      estimateId: string;
      input: UpdateEstimateStatusInput;
    }) => updateEstimateStatus(estimateId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estimateKeys.all });
    },
  });
}
