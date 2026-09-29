/*
@ 백엔드 공통 응답 (errorHandler / 컨트롤러)
- 성공: { success: true, data }
- 실패: { success: false, error: { code, message, fields? } }
  fields는 Zod 검증 실패(code: VALIDATION_ERROR)일 때만 온다
- 프로필 이미지 업로드도 같은 래퍼다. data.imgUrl은 로컬 경로 또는 S3 URL
*/

/**
 * 백엔드 성공 응답
 * @param T - 데이터 타입
 * @returns 백엔드 성공 응답
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  fields?: ApiErrorField[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}
