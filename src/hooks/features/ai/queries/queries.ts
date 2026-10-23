import type { AiFeature, AiUsage, AiUsageData } from '@/types/ai';
import { useQuery, type QueryClient } from '@tanstack/react-query';

import { fetchAiUsage } from '@/lib/api/ai';
import { HttpError } from '@/lib/api/errors';

import { aiKeys } from '@/hooks/features/ai/queries/keys';

/** BE 가 하루 한도를 다 썼을 때 보내는 429 code */
export const AI_DAILY_LIMIT_CODE = 'DAILY_LIMIT_EXCEEDED';

/*
@ 오늘 남은 AI 사용 횟수 쿼리
- 로그인했을 때만 부른다 (비로그인은 401)
- AI 검색 · 초안 응답에 usage 가 같이 오므로, 사용 후에는 다시 조회하지 않고
  setAiUsage 로 캐시를 바로 고친다
*/
export function useAiUsageQuery(enabled: boolean) {
  return useQuery({
    queryKey: aiKeys.usage(),
    queryFn: fetchAiUsage,
    enabled,
    staleTime: 60 * 1000,
    meta: { name: 'AI 사용량' },
  });
}

/** 응답으로 받은 한 기능의 usage 를 캐시에 반영한다 (조회 전이면 아무것도 하지 않는다) */
export function setAiUsage(
  queryClient: QueryClient,
  feature: AiFeature,
  usage: AiUsage,
) {
  queryClient.setQueryData<AiUsageData>(aiKeys.usage(), (previous) =>
    previous ? { ...previous, [feature]: usage } : previous,
  );
}

/*
@ AI 요청 실패 시 남은 횟수 보정
- 하루 한도 429 → 그 기능의 remaining 을 0 으로
- 그 외 실패는 BE 가 하루 횟수에서 차감하지 않으므로 그대로 둔다
*/
export function syncAiUsageOnError(
  queryClient: QueryClient,
  feature: AiFeature,
  error: unknown,
) {
  if (!(error instanceof HttpError) || error.code !== AI_DAILY_LIMIT_CODE) {
    return;
  }
  queryClient.setQueryData<AiUsageData>(aiKeys.usage(), (previous) =>
    previous
      ? { ...previous, [feature]: { ...previous[feature], remaining: 0 } }
      : previous,
  );
}
