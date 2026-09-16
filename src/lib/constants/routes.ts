import type { Role } from '@/types/role';

/*
@ 앱 경로
- 헤더 GNB·프로필 메뉴·가드 리다이렉트에서 사용
- (auth)는 역할별 signin/signup, 보호 페이지는 역할별 home
- *Root 는 하위 탭·상세까지 묶는 prefix (메뉴 활성/비활성 판정)
*/
export const ROUTES = {
  /* 인증 */
  customerSignin: '/customer/signin', // 일반 유저 로그인
  customerSignup: '/customer/signup', // 일반 유저 회원가입
  moverSignin: '/mover/signin', // 기사님 로그인
  moverSignup: '/mover/signup', // 기사님 회원가입

  /* 공개 */
  moverList: '/mover', // 기사님 찾기(목록). /mover/[id] 상세 포함

  /* 일반 유저 GNB */
  customerHome: '/customer/estimate-request', // 견적 요청
  customerEstimatesRoot: '/customer/estimates', // 내 견적 관리 (받은/대기 견적)
  customerEstimates: '/customer/estimates/received', // 내 견적 관리 > 받은 견적

  /* 기사님 GNB */
  moverHome: '/mover/requests', // 받은 요청
  moverEstimatesRoot: '/mover/estimates', // 내 견적 관리 (보낸/반려 견적)
  moverEstimates: '/mover/estimates/sent', // 내 견적 관리 > 보낸 견적

  /* 일반 유저 프로필 메뉴 */
  customerProfileRoot: '/customer/profile', // 프로필 (등록/수정)
  customerProfileEdit: '/customer/profile/edit', // 프로필 수정
  customerLikedMovers: '/customer/liked-movers', // 찜한 기사님
  customerReviewsRoot: '/customer/reviews', // 이사 리뷰 (작성대기/작성한 리뷰)
  customerReviewsPending: '/customer/reviews/pending', // 이사 리뷰 > 작성 대기

  /* 기사님 프로필 메뉴 */
  moverMypage: '/mover/mypage', // 마이페이지 (계정·프로필 수정 포함)
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
@ 비회원 헤더 로그인
- 공개 GNB(기사님 찾기)는 고객 플로우가 기본이라 고객 로그인으로 보낸다
- 기사님은 /mover/signin, 로그인·회원가입 폼에서 역할 전환
*/
export function getGuestSigninPath(): string {
  return ROUTES.customerSignin;
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
@ 로그인해야 볼 수 있는 경로인지 판정
- signin/signup 은 비로그인 전용이므로 제외
- 공개 페이지('/', '/mover', '/mover/{id}')는 제외
- 그 외 /customer/*, /mover/requests|mypage|estimates 는 세션이 있다고 본다
*/
export function isProtectedPath(pathname: string): boolean {
  if (pathname.includes('/signin') || pathname.includes('/signup')) {
    return false;
  }
  return !isPublicPath(pathname);
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
