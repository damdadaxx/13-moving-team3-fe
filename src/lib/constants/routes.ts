import type { Role } from '@/types/role';

/*
@ 인증 관련 경로
- 로그인 후 기본 랜딩 / 가드 리다이렉트에 사용
- (auth) 페이지는 역할별 signin, 보호 페이지는 역할별 home
*/
export const ROUTES = {
  customerHome: '/customer/estimate-request',
  moverHome: '/mover/requests',
  customerSignin: '/customer/signin',
  moverSignin: '/mover/signin',
} as const;

export function getHomePath(role: Role): string {
  return role === 'customer' ? ROUTES.customerHome : ROUTES.moverHome;
}

export function getSigninPath(role: Role): string {
  return role === 'customer' ? ROUTES.customerSignin : ROUTES.moverSignin;
}

/*
@ callbackUrl 검증
- open redirect 방지: 상대 경로만 허용
- 역할 교차 이동 방지: /customer/* ↔ /mover/* 를 섞지 않음
- 로그인 루프 방지: signin/signup 은 home 으로 보냄
*/
export function getSafeCallbackPath(
  role: Role,
  callbackUrl: string | null,
): string {
  const homePath = getHomePath(role);

  if (!callbackUrl) return homePath;
  if (!callbackUrl.startsWith('/')) return homePath;
  if (callbackUrl.startsWith('//')) return homePath;
  if (callbackUrl.includes('/signin') || callbackUrl.includes('/signup')) {
    return homePath;
  }

  const allowedPrefix = role === 'customer' ? '/customer' : '/mover';
  if (!callbackUrl.startsWith(allowedPrefix)) return homePath;

  return callbackUrl;
}
