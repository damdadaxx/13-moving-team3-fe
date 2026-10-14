/*
@ Supabase용 사용자 액세스 토큰 저장소
- BE가 로그인/리프레시/내 정보 조회(/auth/me) 응답 바디에 같이 내려주는 accessToken
  (쿠키는 그대로 httpOnly)을 메모리에만 들고 있다가, Supabase 클라이언트가 요청마다
  Authorization으로 붙인다
- RLS(auth.uid())가 우리 JWT의 sub claim으로 user id를 읽도록 BE가 맞춰둔 상태라,
  이 토큰이 있어야 Realtime/REST에서 "내가 볼 수 있는 행"이 제대로 걸러진다
- 새로고침하면 사라지지만, AuthProvider가 마운트 시 항상 /auth/me를 부르므로
  (clientFetch가 그 응답에서도 캡처) 로그인 액션 없이도 다시 채워진다
*/
let currentToken: string | null = null;
let tokenEpoch = 0;
const listeners = new Set<() => void>();

// access 토큰은 15분. 만료 2분 전에 갈아끼워야 하트비트가 죽은 토큰을 안 보낸다
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000;
const REFRESH_RETRY_MS = 30 * 1000;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function readExpiryMs(token: string): number | null {
  const segment = token.split('.')[1];
  if (!segment) return null;

  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function clearRefreshTimer() {
  if (!refreshTimer) return;
  clearTimeout(refreshTimer);
  refreshTimer = null;
}

/*
@ 만료 전에 /auth/refresh 를 호출해 메모리 토큰을 갈아끼운다
- 하트비트는 이 메모리 값을 다시 읽을 뿐, 백엔드 갱신은 하지 않는다
- 갱신이 실패하면 30초 뒤 한 번 더 시도한다
- clientFetch가 이 파일을 import하므로, 갱신 함수는 타이머 안에서 늦게 가져온다
*/
function scheduleTokenRefresh(token: string | null) {
  clearRefreshTimer();
  if (!token || typeof window === 'undefined') return;

  const expiryMs = readExpiryMs(token);
  const delay =
    expiryMs === null
      ? 12 * 60 * 1000
      : Math.max(expiryMs - Date.now() - REFRESH_BEFORE_EXPIRY_MS, 0);

  refreshTimer = setTimeout(() => {
    void refreshSupabaseAccessToken();
  }, delay);
}

async function refreshSupabaseAccessToken() {
  try {
    const { refreshSession } = await import('@/lib/api/clientFetch');
    const response = await refreshSession();
    if (response.ok || !currentToken) return;

    refreshTimer = setTimeout(() => {
      void refreshSupabaseAccessToken();
    }, REFRESH_RETRY_MS);
  } catch {
    if (!currentToken) return;
    refreshTimer = setTimeout(() => {
      void refreshSupabaseAccessToken();
    }, REFRESH_RETRY_MS);
  }
}

/*
@ 토큰이 바뀌면 이미 열려 있는 Realtime 소켓에도 즉시 반영한다
- 하트비트는 accessToken 콜백의 메모리 값을 다시 보낸다. 그 값이 만료되면
  서버가 채널을 닫고 자동으로 다시 구독하지 않는다
- supabase.realtime.setAuth()로 joined 채널에 새 토큰을 바로 밀어 넣는다
- client.ts가 이 파일을 import하므로, 순환 참조를 피하려고 동적 import로 늦게 가져온다
*/
export function getSupabaseTokenEpoch(): number {
  return tokenEpoch;
}

export function setSupabaseAccessToken(token: string | null) {
  if (token === null) tokenEpoch += 1;
  const changed = currentToken !== token;
  currentToken = token;
  scheduleTokenRefresh(token);
  void import('@/lib/supabase/client').then(({ supabase }) =>
    supabase.realtime.setAuth(),
  );
  if (!changed) return;
  listeners.forEach((listener) => listener());
}

export function subscribeSupabaseAccessToken(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSupabaseAccessToken(): string | null {
  return currentToken;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 백엔드 { success, data } 응답 바디에서 data.accessToken이 있으면 저장한다 */
export function captureSupabaseAccessTokenFromBody(body: unknown): void {
  const data = isRecord(body) ? body.data : undefined;
  const token = isRecord(data) ? data.accessToken : undefined;

  if (typeof token === 'string') setSupabaseAccessToken(token);
}
