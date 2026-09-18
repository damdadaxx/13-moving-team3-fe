import type { ApiErrorField } from '@/lib/api/types';

// HTTP 에러 공유 클래스
// clientFetch, serverFetchClient, QueryProvider에서 공통으로 사용
// 백엔드 errorHandler: { success: false, error: { code, message, fields? } }

export class HttpError extends Error {
  code: string;
  status?: number;
  fields?: ApiErrorField[];

  constructor(
    message: string,
    code: string,
    status?: number,
    fields?: ApiErrorField[],
  ) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}
