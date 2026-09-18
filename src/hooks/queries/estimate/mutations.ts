// tanstack/react-query - estimate mutations (useMutation)
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptEstimate } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 견적 확정
- 확정하면 백엔드가 나머지 견적(NOT_SELECTED)과 요청 상태(CONFIRMED)까지 함께 바꾼다.
  화면이 여러 값을 직접 맞추지 않도록 성공 후 진행 중인 요청을 다시 읽는다.
*/
export function useAcceptEstimateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estimateId: string) => acceptEstimate(estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: estimateKeys.activeRequest() });
    },
  });
}
