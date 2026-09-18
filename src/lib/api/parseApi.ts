import { HttpError } from '@/lib/api/errors';
import type { ApiErrorField } from '@/lib/api/types';

/**
 * 백엔드 에러 응답 스키마
 * {
 *   error: {
 *     code: string;
 *     message: string;
 *     fields: { field: string; message: string }[];
 *   };
 * }
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * 에러 필드 배열을 ApiErrorField[] 타입으로 변환
 * @param value - 에러 필드 배열
 * @returns 에러 필드 배열
 */
function parseErrorFields(value: unknown): ApiErrorField[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const fields = value.filter(
    (item): item is ApiErrorField =>
      isRecord(item) &&
      typeof item.field === 'string' &&
      typeof item.message === 'string',
  );

  return fields.length > 0 ? fields : undefined;
}

/**
 * 응답 바디를 JSON 파싱
 * @param response - 응답
 * @returns 응답 바디
 */
export async function readJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * 에러 코드 추출
 * @param body - 응답 바디
 * @returns 에러 코드
 */
export function getApiErrorCode(body: unknown): string | undefined {
  if (
    isRecord(body) &&
    isRecord(body.error) &&
    typeof body.error.code === 'string'
  ) {
    return body.error.code;
  }

  return undefined;
}

/**
 * 에러 응답을 HttpError 객체로 변환
 * @param body - 응답 바디
 * @param status - 상태 코드
 * @returns HttpError 객체
 */
export function parseApiError(body: unknown, status?: number): HttpError {
  if (isRecord(body) && isRecord(body.error)) {
    const message =
      typeof body.error.message === 'string'
        ? body.error.message
        : '요청 처리 중 오류가 발생했습니다.';
    const code =
      typeof body.error.code === 'string' ? body.error.code : 'UNKNOWN_ERROR';

    return new HttpError(
      message,
      code,
      status,
      parseErrorFields(body.error.fields),
    );
  }

  return new HttpError(
    '요청 처리 중 오류가 발생했습니다.',
    'UNKNOWN_ERROR',
    status,
  );
}

/**
 * 백엔드 성공 응답에서 data만 추출
 * @param body - 응답 바디
 * @returns data (백엔드 성공 응답에서 data만 추출)
 */
export function unwrapApiData<T>(body: unknown): T {
  if (isRecord(body) && body.success === true && 'data' in body) {
    return body.data as T;
  }

  return body as T;
}
