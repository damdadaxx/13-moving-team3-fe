import { routing } from '@/i18n/routing';
import type { Role } from '@/types/role';
import { type Locale, hasLocale } from 'next-intl';

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
  customerEstimatesPending: '/customer/estimates/pending', // 내 견적 관리 > 대기 중인 견적

  /* 기사님 GNB */
  moverHome: '/mover/requests', // 받은 요청
  moverEstimatesRoot: '/mover/estimates', // 내 견적 관리 (보낸/반려 견적)
  moverEstimates: '/mover/estimates/sent', // 내 견적 관리 > 보낸 견적

  /* 일반 유저 프로필 메뉴 */
  customerProfileRoot: '/customer/profile', // 프로필 (등록/수정)
  customerProfileNew: '/customer/profile/new', // 프로필 최초 등록
  customerProfileEdit: '/customer/profile/edit', // 프로필 수정
  customerLikedMovers: '/customer/liked-movers', // 찜한 기사님
  customerReviewsRoot: '/customer/reviews', // 이사 리뷰 (작성대기/작성한 리뷰)
  customerReviewsPending: '/customer/reviews/pending', // 이사 리뷰 > 작성 가능한 리뷰
  customerReviewsCompleted: '/customer/reviews/completed', // 이사 리뷰 > 내가 작성한 리뷰

  /* 기사님 프로필 메뉴 */
  moverMypage: '/mover/mypage', // 마이페이지 (계정·프로필 수정 포함)
  moverProfileRoot: '/mover/mypage/profile', // 기사님 프로필 (등록/수정)
  moverProfileNew: '/mover/mypage/profile/new', // 기사님 프로필 최초 등록
  moverProfileEdit: '/mover/mypage/profile/edit', // 기사님 프로필 수정
  moverAccount: '/mover/mypage/account', // 기본 정보(계정) 수정/보기
} as const;

export function getHomePath(role: Role): string {
  return role === 'customer' ? ROUTES.customerHome : ROUTES.moverHome;
}

/*
@ 프로필 최초 등록 경로
- 회원가입 직후에는 역할에 맞는 프로필 등록 화면으로 보낸다.
*/
export function getProfileNewPath(role: Role): string {
  return role === 'customer'
    ? ROUTES.customerProfileNew
    : ROUTES.moverProfileNew;
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

/* 기사님 상세 (/mover/{id}). requests/mypage/estimates 는 기사님 전용 경로라 제외 */
export function isMoverDetailPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);

  return (
    segments[0] === 'mover' &&
    segments.length === 2 &&
    !MOVER_PROTECTED_SEGMENTS.has(segments[1])
  );
}

/*
@ 기사님이 보면 안 되는 공개 기사님 페이지
- /mover : 기사님 찾기
- /mover/{id} : 기사님 상세
- locale 접두사·쿼리·해시는 빼고 판정한다
*/
export function isMoverBrowsePath(pathname: string): boolean {
  const { path: withoutLocale } = splitLocalePrefix(pathname);
  const path = withoutLocale.split('?')[0].split('#')[0];

  if (path.includes('/signin') || path.includes('/signup')) return false;

  return path === ROUTES.moverList || isMoverDetailPath(path);
}

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
  if (segments.length === 2) return isMoverDetailPath(pathname);

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
@ 이 역할이 머물러도 되는 경로인지
- 고객: 공개 페이지(/, /mover, /mover/{id})와 /customer/*
- 기사님: /mover/requests|mypage|estimates. 기사님 찾기·상세와 /customer/* 는 아니다
- 비회원: 공개 페이지만
- 직전 경로를 기억할 때, 막힌 페이지가 기록을 덮지 않게 쓴다
*/
export function isRoleAllowedPath(
  role: Role | null,
  pathname: string,
): boolean {
  const path = pathname.split('?')[0].split('#')[0];

  if (path.includes('/signin') || path.includes('/signup')) return false;
  if (!role) return isPublicPath(path);
  if (role === 'customer') {
    return isPublicPath(path) || path.startsWith('/customer');
  }

  return path.startsWith('/mover') && !isMoverBrowsePath(path);
}

/*
@ 비로그인 전용 경로
- /customer/signin|signup, /mover/signin|signup
*/
export function isGuestOnlyPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0];

  return path.includes('/signin') || path.includes('/signup');
}

/*
@ 비회원이 로그인해야 들어가는 경로
- (customer) /customer/* (로그인·회원가입 제외)
- (mover) /mover/requests|mypage|estimates
- 공개 페이지와 예시 페이지는 여기 넣지 않는다
*/
export function isLoginRequiredPath(pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0];

  if (isGuestOnlyPath(path)) return false;
  if (path === '/customer' || path.startsWith('/customer/')) return true;

  const segments = path.split('/').filter(Boolean);

  return (
    segments[0] === 'mover' && MOVER_PROTECTED_SEGMENTS.has(segments[1] ?? '')
  );
}

/*
@ 다른 역할 전용 페이지인지
- 고객이 /mover/requests|mypage|estimates 로 가는 경우
- 기사님이 /customer/* 로 가는 경우
- 로그인·회원가입은 역할이 아니라 비로그인 전용이라 여기 넣지 않는다
- 기사님 찾기·상세(/mover, /mover/{id})는 고객·비회원 공개 페이지라 여기 넣지 않는다
*/
export function isOtherRoleProtectedPath(
  role: Role,
  pathname: string,
): boolean {
  const path = pathname.split('?')[0].split('#')[0];

  if (isGuestOnlyPath(path)) return false;

  if (role === 'customer') {
    return (
      path.startsWith('/mover/') &&
      path !== ROUTES.moverList &&
      !isMoverDetailPath(path)
    );
  }

  return path.startsWith('/customer');
}

/*
@ 로그인한 역할이 보면 안 되는 경로
- 로그인·회원가입: 이미 로그인한 사용자
- 고객이 기사님 전용, 기사님이 고객 전용
- 기사님이 기사님 찾기·상세
- 페이지 제목과 라우트 로딩을 비울 때 쓴다
*/
export function isRoleBlockedPath(role: Role, pathname: string): boolean {
  const path = pathname.split('?')[0].split('#')[0];

  if (isGuestOnlyPath(path)) return true;
  if (role === 'mover' && isMoverBrowsePath(path)) return true;

  return isOtherRoleProtectedPath(role, path);
}

/*
@ 경로 앞의 locale 접두사 분리
- '/en/customer/x?a=1' → { locale: 'en', path: '/customer/x?a=1' }
- 접두사가 없으면 locale 은 undefined, path 는 그대로
- callbackUrl 처럼 locale 이 붙어 들어올 수 있는 값을 검사·이동하기 전에 쓴다
*/
export function splitLocalePrefix(path: string): {
  locale?: Locale;
  path: string;
} {
  const match = path.match(/^\/([^/?#]+)(?=$|[/?#])/);
  if (!match || !hasLocale(routing.locales, match[1])) return { path };

  const rest = path.slice(match[0].length);
  return { locale: match[1], path: rest.startsWith('/') ? rest : `/${rest}` };
}

/*
@ callbackUrl 검증
- 반환값은 locale 접두사가 없는 경로다 (이동할 때 @/i18n/navigation 라우터가 locale 을 붙인다)
- open redirect 방지: 상대 경로만 허용
- 로그인 루프 방지: signin/signup 은 home 으로 보냄
- 공개 페이지('/', '/mover', '/mover/{id}')는 역할과 무관하게 허용
  (비회원 상태로 보고 있던 페이지라 로그인 후에도 누구나 돌아갈 수 있어야 함)
- 예외: 기사님 찾기(/mover)·기사님 상세(/mover/{id})는 기사님 계정으로 돌아가지 않고 받은 요청으로 보낸다
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

  // '/en/customer/...' 처럼 locale 이 붙어 와도 같은 기준으로 검사한다
  const { path } = splitLocalePrefix(callbackUrl);
  if (path.startsWith('//')) return homePath;
  if (path.includes('/signin') || path.includes('/signup')) {
    return homePath;
  }

  const pathname = path.split('?')[0].split('#')[0];

  if (isPublicPath(pathname)) {
    // 기사님 찾기·상세는 비회원·고객 전용. 기사님 로그인 복귀는 받은 요청으로 보낸다
    if (role === 'mover' && isMoverBrowsePath(pathname)) return homePath;
    return path;
  }

  const allowedPrefix = role === 'customer' ? '/customer' : '/mover';
  if (!pathname.startsWith(allowedPrefix)) return homePath;

  return path;
}
