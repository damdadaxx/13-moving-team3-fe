// tanstack/react-query - auth queries
import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/lib/api/auth';

import { authKeys } from '@/hooks/queries/auth/keys';

export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    meta: { name: '내 정보' },
  });
}
