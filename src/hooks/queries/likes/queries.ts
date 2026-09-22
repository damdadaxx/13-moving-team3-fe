import { useQuery } from '@tanstack/react-query';

import { fetchLikeStatus } from '@/lib/api/like';

import { likeKeys } from '@/hooks/queries/likes/keys';

/** @ 기사님 찜 여부 쿼리 */
export function useLikeStatusQuery(moverId: string, enabled: boolean) {
  return useQuery({
    queryKey: likeKeys.byMover(moverId),
    queryFn: () => fetchLikeStatus(moverId),
    enabled: Boolean(moverId) && enabled,
    meta: { name: '기사님 찜 여부' },
  });
}
