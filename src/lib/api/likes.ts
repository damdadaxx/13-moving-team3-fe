import type {
  BulkDeleteLikesData,
  GetLikedMoversParams,
  LikedMoverListData,
} from '@/types/like';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

function toLikedMoversUrl({ cursor, size }: GetLikedMoversParams): string {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  if (size !== undefined) searchParams.set('size', String(size));

  const query = searchParams.toString();
  return query ? `${ENDPOINTS.like.mine}?${query}` : ENDPOINTS.like.mine;
}

export function getLikedMovers(params: GetLikedMoversParams = {}) {
  return clientFetch<LikedMoverListData>(toLikedMoversUrl(params));
}

export function bulkDeleteLikes(moverIds: string[]) {
  return clientFetch<BulkDeleteLikesData>(ENDPOINTS.like.bulkDelete, {
    method: 'POST',
    body: JSON.stringify({ moverIds }),
  });
}
