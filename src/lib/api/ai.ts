// AI 기능 공용 API 호출 함수
import type { AiUsageData } from '@/types/ai';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ 오늘 남은 AI 사용 횟수 (GET /ai/usage)
- 로그인 필요. 조회만 하고 횟수를 차감하지 않는다
*/
export function fetchAiUsage(): Promise<AiUsageData> {
  return clientFetch<AiUsageData>(ENDPOINTS.ai.usage);
}
