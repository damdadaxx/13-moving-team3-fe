'use client';

import { ROUTES } from '@/lib/constants/routes';
import ProfileGuard from '@/lib/providers/ProfileGuard';

import { useMoverProfileQuery } from '@/hooks/queries/mover/queries';

interface MoverProfileGuardProps {
  children: React.ReactNode;
}

/*
@ 기사님 프로필 등록 여부 가드
- 흐름(미등록 → 등록 페이지 / 등록 완료 → home / 401 → 로그인)은 공용 ProfileGuard가 담당한다.
- 여기서는 기사님용 프로필 조회와 경로만 넘긴다.
*/
export default function MoverProfileGuard({
  children,
}: MoverProfileGuardProps) {
  const query = useMoverProfileQuery();

  return (
    <ProfileGuard
      query={query}
      profileNewPath={ROUTES.moverProfileNew}
      homePath={ROUTES.moverHome}
      signinPath={ROUTES.moverSignin}
    >
      {children}
    </ProfileGuard>
  );
}
