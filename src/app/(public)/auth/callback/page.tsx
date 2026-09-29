// [메뉴] 로그인
// [페이지] 소셜 로그인 결과 (google / kakao / naver 공통)
/*
@ 흐름
- 백엔드(Passport)가 로그인 처리 후 이 페이지로 302 한다
  - 성공: /auth/callback?callbackUrl=/...
  - 실패: /auth/callback?error=CODE&role=CUSTOMER|MOVER
@ (public) 그룹에 두는 이유
- (auth) 그룹의 AuthGuard 는 로그인 성공 즉시 home 으로 보내서 callbackUrl 이 무시된다
- (public) 은 가드가 없어 이 페이지가 로그인 완료 후 이동을 직접 처리한다
*/
import type { BackendRole } from '@/types/auth';

import { toFrontendRole } from '@/lib/api/auth';

import SocialCallback from '@/components/auth/SocialCallback';

interface SocialCallbackPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined): string | null {
  return typeof value === 'string' ? value : null;
}

function isBackendRole(value: string | null): value is BackendRole {
  return value === 'CUSTOMER' || value === 'MOVER';
}

export default async function SocialCallbackPage({
  searchParams,
}: SocialCallbackPageProps) {
  const query = await searchParams;
  const role = getParam(query.role);

  return (
    <SocialCallback
      error={getParam(query.error)}
      role={isBackendRole(role) ? toFrontendRole(role) : null}
      callbackUrl={getParam(query.callbackUrl)}
    />
  );
}
