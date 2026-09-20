// tanstack/react-query - estimate queries (useQuery)
import { useQuery } from '@tanstack/react-query';

import { getActiveEstimateRequest } from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimate/keys';

/*
@ 진행 중인 견적 요청 + 그 요청에 들어온 견적 목록. 요청이 없으면 data가 null
- 견적요청 페이지: 있으면 폼 대신 "진행 중" 화면을 보여준다
- 대기 중인 견적 페이지: estimates를 그대로 목록에 쓴다
*/
export function useActiveEstimateRequestQuery() {
  return useQuery({
    queryKey: estimateKeys.activeRequest(),
    queryFn: getActiveEstimateRequest,
    meta: { name: '진행 중인 견적 요청' },
  });
}
