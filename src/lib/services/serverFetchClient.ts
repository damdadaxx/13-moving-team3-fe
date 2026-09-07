import { HttpError } from '@/lib/api/errors';

// 서버 컴포넌트 전용 fetch 래퍼 (쿠키/헤더는 호출 측에서 주입)
export default async function serverFetchClient(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch {
    throw new HttpError(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      'NETWORK_ERROR',
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new HttpError(
      errorBody?.message ?? '요청 처리 중 오류가 발생했습니다.',
      errorBody?.code ?? 'UNKNOWN_ERROR',
      response.status,
    );
  }

  return response;
}
