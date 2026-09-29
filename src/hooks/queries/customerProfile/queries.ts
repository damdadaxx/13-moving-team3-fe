import { useQuery } from '@tanstack/react-query';

import { getCustomerProfile } from '@/lib/api/customerProfile';

import { customerProfileKeys } from '@/hooks/queries/customerProfile/keys';

/*=================================================
고객 프로필 Query
=================================================*/

/*
@ 현재 로그인한 고객의 프로필 조회
- CustomerProfile 객체: 프로필이 등록된 고객
- null: GET /customer/profile이 404를 반환한 프로필 미등록 고객
- error: 네트워크 또는 서버 오류로 등록 여부를 확인할 수 없는 상태
- customer layout의 AuthGuard 안에서 사용하므로 CUSTOMER 인증이 끝난 뒤에만 실행된다.
*/
export function useCustomerProfileQuery() {
  return useQuery({
    queryKey: customerProfileKeys.detail(),
    queryFn: getCustomerProfile,
    staleTime: 5 * 60 * 1000,
    meta: { name: '내 고객 프로필' },
  });
}
