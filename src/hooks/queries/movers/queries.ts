import { useQuery } from '@tanstack/react-query';

import { fetchMoverDetail } from '@/lib/api/mover';

import { moverKeys } from '@/hooks/queries/movers/keys';

/** @ 기사님 상세 쿼리 */
export function useMoverDetailQuery(id: string) {
  return useQuery({
    queryKey: moverKeys.detail(id),
    queryFn: () => fetchMoverDetail(id),
    enabled: Boolean(id),
    meta: { name: '기사님 상세' },
  });
}
