import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

// 토큰 갱신 중복 요청 방지용 싱글톤 프로미스
let refreshPromise: Promise<Response> | null = null;

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

    if (errorBody?.code === 'TOKEN_EXPIRED' && !init._retried) {
      try {
        const refreshResponse = await requestRefresh();

        if (refreshResponse.ok) {
          return clientFetch<T>(input, { ...init, _retried: true });
        }
      } catch {
        throw new HttpError(
          '세션 갱신에 실패했습니다. 다시 로그인해주세요.',
          'REFRESH_FAILED',
        );
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new HttpError(
      errorBody?.message ?? '요청 처리 중 오류가 발생했습니다.',
      errorBody?.code ?? 'UNKNOWN_ERROR',
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
