import type { MoverDetail, MoverListData, MoverListQuery } from '@/types/mover';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** 기사님 목록 조회 쿼리 파라미터 변환
 * @param query 기사님 목록 조회 쿼리
 * @returns 기사님 목록 조회 쿼리 파라미터
 */
function toSearchParams(query: MoverListQuery): string {
  const params = new URLSearchParams();

  if (query.keyword) params.set('keyword', query.keyword);
  if (query.region) params.set('region', query.region);
  if (query.serviceType) params.set('serviceType', query.serviceType);
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.size) params.set('size', String(query.size));

  return params.toString() ? `?${params.toString()}` : '';
}

/*
@ 기사님 목록 조회 (GET /mover)
- 비회원도 호출할 수 있는 공개 API
- 커서가 있으면 다음 페이지, 없으면 첫 페이지
*/
export function fetchMoverList(
  query: MoverListQuery = {},
): Promise<MoverListData> {
  return clientFetch<MoverListData>(
    `${ENDPOINTS.mover.list}${toSearchParams(query)}`,
  );
}

/*
@ 기사님 상세 조회 (GET /mover/{id})
- 비회원도 호출할 수 있는 공개 API
*/
export function fetchMoverDetail(id: string): Promise<MoverDetail> {
  return clientFetch<MoverDetail>(ENDPOINTS.mover.detail(id));
}
