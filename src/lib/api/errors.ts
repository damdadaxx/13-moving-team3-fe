// HTTP 에러 공유 클래스
// clientFetch, serverFetchClient, QueryProvider에서 공통으로 사용

export class HttpError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.status = status;
  }
}
