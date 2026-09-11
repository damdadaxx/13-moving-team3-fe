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
  customerSignup: '/customer/signup',
  moverSignin: '/mover/signin',
  moverSignup: '/mover/signup',
} as const;

export function getHomePath(role: Role): string {
  return role === 'customer' ? ROUTES.customerHome : ROUTES.moverHome;
}

export function getSigninPath(role: Role): string {
  return role === 'customer' ? ROUTES.customerSignin : ROUTES.moverSignin;
}

export function getSignupPath(role: Role): string {
  return role === 'customer' ? ROUTES.customerSignup : ROUTES.moverSignup;
}

/*
@ /mover 하위의 보호 경로 최상위 세그먼트
- (mover) 라우트 그룹(기사님 전용)과 동기화해서 유지한다: requests, mypage, estimates
- /mover, /mover/[id] 는 여기 없으므로 공개 페이지로 취급된다
*/
const MOVER_PROTECTED_SEGMENTS = new Set(['requests', 'mypage', 'estimates']);

/*
@ 비회원도 보는 공개 페이지인지 판정 ((public) 라우트 그룹 기준)
- '/' : 랜딩
- '/mover' : 기사님 목록
- '/mover/{id}' : 기사님 상세 (단, requests/mypage/estimates 같은 보호 경로 제외)
*/
function isPublicPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return true; // '/'
  if (segments[0] !== 'mover') return false;
  if (segments.length === 1) return true; // '/mover'
  if (segments.length === 2) return !MOVER_PROTECTED_SEGMENTS.has(segments[1]); // '/mover/{id}'

  return false;
}

/*
@ callbackUrl 검증
- open redirect 방지: 상대 경로만 허용
- 로그인 루프 방지: signin/signup 은 home 으로 보냄
- 공개 페이지('/', '/mover', '/mover/{id}')는 역할과 무관하게 허용
  (비회원 상태로 보고 있던 페이지라 로그인 후에도 누구나 돌아갈 수 있어야 함)
- 그 외에는 역할 교차 이동 방지: /customer/* ↔ /mover/* 를 섞지 않음
  (예: 고객이 기사님 전용 /mover/requests로 돌아오는 것은 막는다)
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

  const pathname = callbackUrl.split('?')[0].split('#')[0];

  if (isPublicPath(pathname)) return callbackUrl;

  const allowedPrefix = role === 'customer' ? '/customer' : '/mover';
  if (!pathname.startsWith(allowedPrefix)) return homePath;

  return callbackUrl;
}
