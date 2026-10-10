// 로그인 사용자 정보 로컬 캐시
import { useSyncExternalStore } from 'react';

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

/*
@ raw 문자열이 그대로면 이전에 파싱해 둔 같은 객체를 반환한다
- useSyncExternalStore의 getSnapshot은 변화가 없으면 매번 "같은 참조"를 돌려줘야 한다.
  JSON.parse를 호출마다 새로 하면 내용이 같아도 매번 다른 객체라, 리액트가 "계속 바뀐다"고
  판단해 무한 루프로 보고 에러를 던진다 ("The result of getSnapshot should be cached").
*/
let cachedRaw: string | null = null;
let cachedUser: AuthUser | undefined;

/** 저장된 값이 없으면 undefined (react-hook의 "initialData 없음"과 같은 의미) */
export function readStoredAuthUser(): AuthUser | undefined {
  if (typeof window === 'undefined') return undefined;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  } catch {
    return undefined;
  }

  if (raw === cachedRaw) return cachedUser;

  try {
    cachedUser = raw ? (JSON.parse(raw) as AuthUser) : undefined;
  } catch {
    cachedUser = undefined;
  }
  cachedRaw = raw;
  return cachedUser;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

/** undefined */
function getServerSnapshot(): undefined {
  return undefined;
}

/*
@ useMeQuery의 initialData로 쓰는 훅
- readStoredAuthUser를 useQuery의 initialData에 바로 넘기면, 리액트가 서버/클라이언트
  첫 렌더를 맞추려고 하이드레이션 중에도 "지금 렌더"에서 바로 localStorage를 읽어버려서
  서버(항상 undefined)와 클라이언트(실제 값)가 첫 렌더부터 어긋나 하이드레이션 에러가 났다.
- useSyncExternalStore로 바꾸면 리액트가 하이드레이션 중에는 getServerSnapshot(undefined)을
  그대로 쓰고, 하이드레이션이 끝난 직후에만 실제 localStorage 값으로 다시 렌더한다 —
  서버와 첫 렌더가 항상 같아서 에러가 없고, 그 다음 렌더부터는 기존처럼 값이 바로 보인다.
*/
export function useStoredAuthUser(): AuthUser | undefined {
  return useSyncExternalStore(subscribe, readStoredAuthUser, getServerSnapshot);
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
