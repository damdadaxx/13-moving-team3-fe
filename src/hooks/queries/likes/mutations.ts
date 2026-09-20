import type { LikeStatus } from '@/types/like';
import type { MoverDetail } from '@/types/mover';
import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { createLike, deleteLike } from '@/lib/api/like';

import { likeKeys } from '@/hooks/queries/likes/keys';
import { moverKeys } from '@/hooks/queries/movers/keys';

interface LikeOptimisticContext {
  previousStatus: LikeStatus | undefined;
  previousMover: MoverDetail | undefined;
}

/** 좋아요 상태 캐시 업데이트 */
function setLikeStatus(
  queryClient: QueryClient,
  moverId: string,
  status: LikeStatus,
) {
  queryClient.setQueryData(likeKeys.byMover(moverId), status);
  queryClient.setQueryData<MoverDetail>(moverKeys.detail(moverId), (current) =>
    current ? { ...current, likeCount: status.likeCount } : current,
  );
}

/** 좋아요 상태 캐시 업데이트 */
function getOptimisticLikeCount(
  currentCount: number,
  wasLiked: boolean,
  nextIsLiked: boolean,
) {
  if (wasLiked === nextIsLiked) return currentCount;
  return nextIsLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
}

/*
@ 찜하기 낙관적 업데이트
- 클릭 즉시 캐시를 바꿔 UI를 먼저 반영한다
- 진행 중인 조회가 낙관적 값을 덮어쓰지 않도록 취소한다
- 실패하면 이전 캐시로 롤백한다
*/
async function applyOptimisticLike(
  queryClient: QueryClient,
  moverId: string,
  nextIsLiked: boolean,
): Promise<LikeOptimisticContext> {
  await queryClient.cancelQueries({ queryKey: likeKeys.byMover(moverId) });
  await queryClient.cancelQueries({ queryKey: moverKeys.detail(moverId) });

  const previousStatus = queryClient.getQueryData<LikeStatus>(
    likeKeys.byMover(moverId),
  );
  const previousMover = queryClient.getQueryData<MoverDetail>(
    moverKeys.detail(moverId),
  );
  const wasLiked = previousStatus?.isLiked ?? false;
  const currentCount =
    previousStatus?.likeCount ?? previousMover?.likeCount ?? 0;

  setLikeStatus(queryClient, moverId, {
    isLiked: nextIsLiked,
    likeCount: getOptimisticLikeCount(currentCount, wasLiked, nextIsLiked),
    likeId: nextIsLiked ? previousStatus?.likeId : undefined,
  });

  return { previousStatus, previousMover };
}

/** 좋아요 상태 캐시 롤백 */
function rollbackOptimisticLike(
  queryClient: QueryClient,
  moverId: string,
  context: LikeOptimisticContext | undefined,
) {
  if (!context) return;

  if (context.previousStatus === undefined) {
    queryClient.removeQueries({ queryKey: likeKeys.byMover(moverId) });
  } else {
    queryClient.setQueryData(likeKeys.byMover(moverId), context.previousStatus);
  }

  if (context.previousMover !== undefined) {
    queryClient.setQueryData(moverKeys.detail(moverId), context.previousMover);
  }
}

/** 좋아요 생성 뮤테이션 */
export function useCreateLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLike,
    onMutate: (moverId) => applyOptimisticLike(queryClient, moverId, true),
    onError: (_error, moverId, context) => {
      rollbackOptimisticLike(queryClient, moverId, context);
    },
    onSuccess: (data, moverId) => {
      setLikeStatus(queryClient, moverId, {
        isLiked: true,
        likeCount: data.likeCount,
        likeId: data.like.id,
      });
    },
  });
}

/** 좋아요 삭제 뮤테이션 */
export function useDeleteLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onMutate: (moverId) => applyOptimisticLike(queryClient, moverId, false),
    onError: (_error, moverId, context) => {
      rollbackOptimisticLike(queryClient, moverId, context);
    },
    onSuccess: (data, moverId) => {
      setLikeStatus(queryClient, moverId, {
        isLiked: false,
        likeCount: data.likeCount,
      });
    },
  });
}
