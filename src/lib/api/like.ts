import type {
  CreateLikeResult,
  DeleteLikeResult,
  LikeStatus,
} from '@/types/like';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ 이 기사님 찜 여부 조회 (GET /likes/me/{moverId})
- 로그인 필요
*/
export function fetchLikeStatus(moverId: string): Promise<LikeStatus> {
  return clientFetch<LikeStatus>(ENDPOINTS.like.meByMover(moverId));
}

/*
@ 기사님 찜하기 (POST /likes)
- body: { moverId }
- CUSTOMER만 가능하고, 같은 기사는 한 번만 찜할 수 있다
*/
export function createLike(moverId: string): Promise<CreateLikeResult> {
  return clientFetch<CreateLikeResult>(ENDPOINTS.like.create, {
    method: 'POST',
    body: JSON.stringify({ moverId }),
  });
}

/*
@ 찜 취소 (DELETE /likes/{moverId})
- CUSTOMER만 가능하고, 본인 찜만 취소할 수 있다
*/
export function deleteLike(moverId: string): Promise<DeleteLikeResult> {
  return clientFetch<DeleteLikeResult>(ENDPOINTS.like.delete(moverId), {
    method: 'DELETE',
  });
}
