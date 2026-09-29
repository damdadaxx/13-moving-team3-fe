import { useQuery } from '@tanstack/react-query';

import { getMoverProfile } from '@/lib/api/moverProfile';

import { moverProfileKeys } from '@/hooks/queries/moverProfile/keys';

/*
@ 내 기사님 프로필
- undefined: 사용할 수 있는 조회 결과 없음
- null: 404, 프로필 미등록
- 객체: 등록 완료
*/
export function useMoverProfileQuery() {
  return useQuery({
    queryKey: moverProfileKeys.detail(),
    queryFn: getMoverProfile,
    staleTime: 5 * 60 * 1000,
    meta: { name: '내 기사님 프로필' },
  });
}
