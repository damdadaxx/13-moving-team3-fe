// 로그인 사용자 정보 로컬 캐시
import type { AuthUser } from '@/types/auth';

const AUTH_USER_STORAGE_KEY = 'moving:authUser';

/*
@ 쓰는 이유
- 새로고침할 때마다 GET /auth/me 응답을 기다리는 동안 AuthGuard/ProfileGuard가
  로딩 화면(스켈레톤)을 보여줘서, 로그인된 사용자도 페이지를 옮길 때마다 화면이
  한 번씩 깜빡였다.
- 로그인 성공 시 받은 사용자 정보를 저장해 뒀다가, 다음 로드에서 그 값으로 먼저
  그리고(useMeQuery의 initialData) 백그라운드로 실제 세션을 다시 확인해 틀리면
  조용히 바로잡는다. 로그인 여부를 최종 결정하는 건 여전히 서버 쿠키다 — 이 값은
  "첫 화면"을 미리 보여주기 위한 힌트일 뿐이다.
- 저장된 값이 아예 없으면(처음 방문·로그아웃 상태) initialData를 주지 않아서
  기존처럼 정상적으로 로딩 화면을 보여준다. 게스트가 로그인한 것처럼 먼저 그려지는
  일은 없다.
*/

/** 저장된 값이 없으면 undefined (react-hook의 "initialData 없음"과 같은 의미) */
export function readStoredAuthUser(): AuthUser | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : undefined;
  } catch {
    return undefined;
  }
}

/** user가 null이면(로그아웃·비로그인) 저장된 값을 지운다 */
export function writeStoredAuthUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;

  try {
    if (user) {
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  } catch {
    // 프라이빗 모드 등 저장소를 쓸 수 없는 환경에서도 로그인 자체는 계속 동작해야 한다
  }
}
