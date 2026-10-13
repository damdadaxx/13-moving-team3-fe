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

/*
@ 토큰이 바뀌면 이미 열려 있는 Realtime 소켓에도 즉시 반영한다
- realtime-js는 소켓 connect 시점에만 accessToken 콜백을 다시 불러온다. 소켓이 이미 연결된
  채 로그인/로그아웃하면(=토큰만 바뀜) 재연결이 일어나지 않아 예전 인증 상태로 남는다
- supabase.realtime.setAuth()를 직접 불러서 그 자리에서 강제로 다시 인증시킨다
- client.ts가 이 파일을 import하므로, 순환 참조를 피하려고 동적 import로 늦게 가져온다
*/
export function setSupabaseAccessToken(token: string | null) {
  currentToken = token;
  void import('@/lib/supabase/client').then(({ supabase }) =>
    supabase.realtime.setAuth(),
  );
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
