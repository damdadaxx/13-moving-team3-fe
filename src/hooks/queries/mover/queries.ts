// tanstack/react-query - mover queries
import { useQuery } from '@tanstack/react-query';

import { getMyMoverProfile } from '@/lib/api/mover';

import { moverKeys } from '@/hooks/queries/mover/keys';

/*
@ 내 기사님 프로필 - "서비스 가능 지역" 필터에 필요한 serviceRegions를 가져오는 용도로 쓴다
*/
export function useMoverProfileQuery() {
  return useQuery({
    queryKey: moverKeys.profile(),
    queryFn: getMyMoverProfile,
    meta: { name: '내 기사님 프로필' },
  });
}
