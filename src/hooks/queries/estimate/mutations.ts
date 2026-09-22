// tanstack/react-query - estimate mutations
import type { UpdateEstimateStatusInput } from '@/types/estimate';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createEstimate,
  createEstimateRequest,
  updateEstimateStatus,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 견적 요청 생성
- 성공하면 "진행 중인 요청"이 생기므로 관련 캐시를 무효화한다
  (아직 조회 쿼리는 없지만, 나중에 추가돼도 이 자리에서 함께 갱신된다)
*/
export function useCreateEstimateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEstimateRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estimateKeys.all });
    },
  });
}

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
