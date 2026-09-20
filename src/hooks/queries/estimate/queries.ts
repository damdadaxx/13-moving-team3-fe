// tanstack/react-query - estimate queries
import { useQuery } from '@tanstack/react-query';

import { getActiveEstimateRequest } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 진행 중인 견적 요청
- 있으면 견적 요청 폼 대신 "진행 중" 화면을 보여준다
- 견적 요청을 새로 만들면 mutation이 estimateKeys.all을 무효화해 이 쿼리도 다시 받는다
*/
export function useActiveEstimateRequestQuery() {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    meta: { name: '진행 중인 견적 요청' },
  });
}
