import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

// 토큰 갱신 중복 요청 방지용 싱글톤 프로미스
let refreshPromise: Promise<Response> | null = null;

/*
@ 토큰 갱신을 시도하지 않는 경로 (로그인 전 요청)
- 백엔드는 로그인 실패(비밀번호 틀림)도 401 UNAUTHORIZED로 내려준다
- 이때 refresh를 시도하면 refresh도 401이라, 사용자에게는 원래 실패 사유 대신
  "세션 갱신에 실패했습니다"가 보인다 → 로그인 전 요청은 401을 그대로 넘긴다
*/
const NO_REFRESH_PATHS: string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.signUp,
  ENDPOINTS.auth.refresh,
  // 소셜은 프로바이더별 경로라 공통 앞부분('/api/auth/social')만 본다
  ENDPOINTS.auth.social('google').replace(/\/google$/, ''),
];

function skipsRefresh(input: RequestInfo | URL): boolean {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.pathname
        : input.url;

  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

// _retried: 토큰 갱신 후 재시도 여부 추적 (무한 루프 방지)
interface ClientFetchInit extends RequestInit {
  _retried?: boolean;
}

async function requestRefresh(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(ENDPOINTS.auth.refresh, {
      method: 'POST',
      credentials: 'same-origin',
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * 브라우저 fetch 래퍼
 * - credentials: same-origin
 *   프록시(app/api/[...path]/route.ts)를 통해 항상 같은 도메인으로만 요청이 나가는 구조라 same-origin으로 충분
 *   include 대신 same-origin을 쓰는 이유: 실수로 외부 절대 URL이 들어와도 쿠키가 새어나가지 않도록 방어
 */
export default async function clientFetch<T = unknown>(
  input: RequestInfo | URL,
  init: ClientFetchInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, {
      ...init,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  } catch {
    throw new HttpError(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      'NETWORK_ERROR',
    );
  }

  if (response.status === 401) {
    const errorBody = await response
      .clone()
      .json()
      .catch(() => null);

    // 백엔드 에러 code는 { error: { code } }로 감싸져 온다 (한 단계 아래)
    const code = errorBody?.error?.code ?? errorBody?.code;
    // 백엔드는 만료/미인증 모두 UNAUTHORIZED. TOKEN_EXPIRED가 오면 그것도 갱신.
    const shouldRefresh =
      (code === 'TOKEN_EXPIRED' || code === 'UNAUTHORIZED') &&
      !skipsRefresh(input);

    if (shouldRefresh && !init._retried) {
      let refreshResponse: Response;
      try {
        refreshResponse = await requestRefresh();
      } catch {
        throw new HttpError(
          '세션 갱신에 실패했습니다. 다시 로그인해주세요.',
          'REFRESH_FAILED',
          401,
        );
      }

      if (refreshResponse.ok) {
        return clientFetch<T>(input, { ...init, _retried: true });
      }

      throw new HttpError(
        '세션 갱신에 실패했습니다. 다시 로그인해주세요.',
        'REFRESH_FAILED',
        401,
      );
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new HttpError(
      errorBody?.error?.message ??
        errorBody?.message ??
        '요청 처리 중 오류가 발생했습니다.',
      errorBody?.error?.code ?? errorBody?.code ?? 'UNKNOWN_ERROR',
      response.status,
    );
  }

  // { success: true, data }면 data만 반환
  const body = (await response.json()) as unknown;
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    body.success === true &&
    'data' in body
  ) {
    return (body as { data: T }).data;
  }

  return body as T;
}
