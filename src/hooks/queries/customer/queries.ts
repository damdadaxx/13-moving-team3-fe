// tanstack/react-query - customer queries
import { useQuery } from '@tanstack/react-query';

import { getCustomerProfile } from '@/lib/api/customer';

import { customerKeys } from '@/hooks/queries/customer/keys';

/*
@ 고객 프로필
- 등록 전에는 null이다 (에러가 아니다)
- 견적 요청은 프로필을 참조하므로, 없으면 요청 자체가 404로 막힌다
*/
export function useCustomerProfileQuery() {
  return useQuery({
    queryKey: customerKeys.profile(),
    queryFn: getCustomerProfile,
    staleTime: 5 * 60 * 1000,
    meta: { name: '고객 프로필' },
  });
}
