import { HttpError } from '@/lib/api/errors';
import { parseApiError, readJsonBody, unwrapApiData } from '@/lib/api/parseApi';

/*
@ 서버 컴포넌트 전용 fetch 래퍼
- 쿠키/헤더는 호출 측에서 주입 (JSON Content-Type 도 강제하지 않음)
- FormData(이미지 업로드 등): Content-Type 을 비운다
  Node fetch 가 boundary 포함 multipart/form-data 를 직접 붙여야 파싱이 된다
- 성공/실패 파싱은 clientFetch와 같다
  성공: { success: true, data }에서 data만 반환
  실패: { success: false, error } → HttpError
*/
export default async function serverFetchClient<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;

  const headers = new Headers(init.headers);
  if (init.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  try {
    response = await fetch(input, {
      ...init,
      headers,
    });
  } catch {
    throw new HttpError(
      '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      'NETWORK_ERROR',
    );
  }

  if (!response.ok) {
    throw parseApiError(await readJsonBody(response), response.status);
  }

  return unwrapApiData<T>(await readJsonBody(response));
}
