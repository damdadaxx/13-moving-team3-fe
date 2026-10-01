'use client';

import { ROUTES } from '@/lib/constants/routes';
import ProfileGuard from '@/lib/providers/ProfileGuard';

import { useCustomerProfileQuery } from '@/hooks/features/customer/queries/queries';

interface CustomerProfileGuardProps {
  children: React.ReactNode;
}

/*
@ 고객 프로필 등록 여부 가드
- 흐름(미등록 → 등록 페이지 / 등록 완료 → home / 401 → 로그인)은 공용 ProfileGuard가 담당한다.
- 여기서는 고객용 프로필 조회와 경로만 넘긴다.
*/
export default function CustomerProfileGuard({
  children,
}: CustomerProfileGuardProps) {
  const query = useCustomerProfileQuery();

  return (
    <ProfileGuard
      query={query}
      profileNewPath={ROUTES.customerProfileNew}
      homePath={ROUTES.customerHome}
      signinPath={ROUTES.customerSignin}
    >
      {children}
    </ProfileGuard>
  );
}
