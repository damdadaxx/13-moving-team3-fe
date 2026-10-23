// AI 기능(기사님 AI 검색 · 리뷰 초안) 공용 타입

/** BE aiRateLimit 의 기능 이름 */
export type AiFeature = 'moverSearch' | 'reviewDraft';

/*
@ 오늘 남은 AI 사용 횟수
- 한국시간 자정에 초기화된다 (resetAt). 실패한 요청은 차감되지 않는다
- BE 가 limit · remaining · resetAt 세 값만 내려준다
*/
export interface AiUsage {
  limit: number;
  remaining: number;
  resetAt: string;
}

/** GET /ai/usage 응답 */
export type AiUsageData = Record<AiFeature, AiUsage>;
