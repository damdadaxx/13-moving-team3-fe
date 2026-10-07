// tanstack/react-query - auth queries
import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/lib/api/auth';
import { readStoredAuthUser } from '@/lib/storage/authUserStorage';

import { authKeys } from '@/hooks/features/auth/queries/keys';

/*
@ initialData로 localStorage에 저장된 마지막 사용자 정보를 먼저 보여준다
- initialDataUpdatedAt: 0 → 즉시 stale 취급돼 마운트하자마자 실제 세션을
  백그라운드로 다시 확인한다(기본 refetchOnMount). 화면은 그 결과가 올 때까지
  저장된 값으로 먼저 그려서 AuthGuard의 로딩 화면이 매번 번쩍이지 않게 한다.
- 저장된 값이 없으면(처음 방문·로그아웃) initialData가 undefined라 평소처럼
  로딩 상태로 시작한다.
*/
export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    initialData: readStoredAuthUser,
    initialDataUpdatedAt: 0,
    meta: { name: '내 정보' },
  });
}
