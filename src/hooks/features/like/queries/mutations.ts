import type { LikeStatus } from '@/types/like';
import type { MoverDetail, MoverListData, MoverListItem } from '@/types/mover';
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query';

import { createLike, deleteLike, bulkDeleteLikes } from '@/lib/api/like';

import { likeKeys } from '@/hooks/features/like/queries/keys';
import { moverKeys } from '@/hooks/features/mover/queries/keys';

interface LikeOptimisticContext {
  previousStatus: LikeStatus | undefined;
  previousMover: MoverDetail | undefined;
  previousLiked: [QueryKey, MoverListData | undefined][];
  previousLists: [QueryKey, InfiniteData<MoverListData> | undefined][];
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

const likedMoverListKey = [...moverKeys.all, 'liked'] as const;

/*
@ 기사님 찾기 하트용 찜 목록
- 카드 하트는 이 캐시에 id가 있는지로 그린다
- 상세·목록에 남아 있는 기사님 정보로 항목을 만들어 바로 넣는다
*/
function findCachedMoverListItem(
  queryClient: QueryClient,
  moverId: string,
): MoverListItem | undefined {
  const detail = queryClient.getQueryData<MoverDetail>(
    moverKeys.detail(moverId),
  );
  if (detail) return detail;

  const lists = queryClient.getQueriesData<InfiniteData<MoverListData>>({
    queryKey: moverKeys.lists(),
  });

  for (const [, data] of lists) {
    for (const page of data?.pages ?? []) {
      const mover = page.list.find((item) => item.id === moverId);
      if (mover) return mover;
    }
  }

  return undefined;
}

function nextLikedMoverList(
  current: MoverListData,
  moverId: string,
  nextIsLiked: boolean,
  likeCount: number,
  cachedMover: MoverListItem | undefined,
  limit: number | undefined,
): MoverListData {
  if (!nextIsLiked) {
    const list = current.list.filter((mover) => mover.id !== moverId);
    if (list.length === current.list.length) return current;
    return {
      ...current,
      totalCount: Math.max(0, current.totalCount - 1),
      list,
    };
  }

  const alreadyLiked = current.list.some((mover) => mover.id === moverId);
  if (alreadyLiked) {
    return {
      ...current,
      list: current.list.map((mover) =>
        mover.id === moverId ? { ...mover, isLiked: true, likeCount } : mover,
      ),
    };
  }

  if (!cachedMover) return current;

  const list = [{ ...cachedMover, isLiked: true, likeCount }, ...current.list];

  return {
    ...current,
    totalCount: current.totalCount + 1,
    list: limit ? list.slice(0, limit) : list,
  };
}

function syncLikedMoverListCache(
  queryClient: QueryClient,
  moverId: string,
  nextIsLiked: boolean,
  likeCount: number,
) {
  const cachedMover = findCachedMoverListItem(queryClient, moverId);
  const likedQueries = queryClient.getQueriesData<MoverListData>({
    queryKey: likedMoverListKey,
  });

  for (const [queryKey, current] of likedQueries) {
    if (!current) continue;

    const size = queryKey[2];
    const next = nextLikedMoverList(
      current,
      moverId,
      nextIsLiked,
      likeCount,
      cachedMover,
      typeof size === 'number' ? size : undefined,
    );
    if (next !== current) queryClient.setQueryData(queryKey, next);
  }
}

/*
@ 기사님 찾기 목록의 찜 수
- 목록은 1분 동안 다시 받지 않는다
- 상세에서 찜한 뒤 돌아오면 하트는 찜 목록 캐시로 바뀌지만, 카드 숫자는 이 목록에 남아 있다
- 같은 기사님 칸의 찜 수와 찜 여부만 바로 고친다
*/
function syncMoverListLikeCache(
  queryClient: QueryClient,
  moverId: string,
  nextIsLiked: boolean,
  likeCount: number,
) {
  const lists = queryClient.getQueriesData<InfiniteData<MoverListData>>({
    queryKey: moverKeys.lists(),
  });

  for (const [queryKey, current] of lists) {
    if (!current) continue;

    let changed = false;
    const pages = current.pages.map((page) => {
      let pageChanged = false;
      const list = page.list.map((mover) => {
        if (
          mover.id !== moverId ||
          (mover.likeCount === likeCount && mover.isLiked === nextIsLiked)
        ) {
          return mover;
        }

        pageChanged = true;
        changed = true;
        return { ...mover, isLiked: nextIsLiked, likeCount };
      });

      return pageChanged ? { ...page, list } : page;
    });

    if (changed) queryClient.setQueryData(queryKey, { ...current, pages });
  }
}

function invalidateLikedMoverLists(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: likedMoverListKey });
  void queryClient.invalidateQueries({ queryKey: likeKeys.mine() });
}

/*
@ 찜하기 낙관적 업데이트
- 클릭 즉시 캐시를 바꿔 UI를 먼저 반영한다
- 진행 중인 조회가 낙관적 값을 덮어쓰지 않도록 취소한다
- 실패하면 이전 캐시로 롤백한다
- 기사님 찾기 하트 캐시와 목록 카드의 찜 수도 같이 바꾼다
*/
async function applyOptimisticLike(
  queryClient: QueryClient,
  moverId: string,
  nextIsLiked: boolean,
): Promise<LikeOptimisticContext> {
  await queryClient.cancelQueries({ queryKey: likeKeys.byMover(moverId) });
  await queryClient.cancelQueries({ queryKey: moverKeys.detail(moverId) });
  await queryClient.cancelQueries({ queryKey: likedMoverListKey });
  await queryClient.cancelQueries({ queryKey: moverKeys.lists() });

  const previousStatus = queryClient.getQueryData<LikeStatus>(
    likeKeys.byMover(moverId),
  );
  const previousMover = queryClient.getQueryData<MoverDetail>(
    moverKeys.detail(moverId),
  );
  const previousLiked = queryClient.getQueriesData<MoverListData>({
    queryKey: likedMoverListKey,
  });
  const previousLists = queryClient.getQueriesData<InfiniteData<MoverListData>>(
    {
      queryKey: moverKeys.lists(),
    },
  );
  const wasLiked = previousStatus?.isLiked ?? false;
  const currentCount =
    previousStatus?.likeCount ?? previousMover?.likeCount ?? 0;
  const likeCount = getOptimisticLikeCount(currentCount, wasLiked, nextIsLiked);

  setLikeStatus(queryClient, moverId, {
    isLiked: nextIsLiked,
    likeCount,
    likeId: nextIsLiked ? previousStatus?.likeId : undefined,
  });
  syncLikedMoverListCache(queryClient, moverId, nextIsLiked, likeCount);
  syncMoverListLikeCache(queryClient, moverId, nextIsLiked, likeCount);

  return { previousStatus, previousMover, previousLiked, previousLists };
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

  for (const [queryKey, data] of context.previousLiked) {
    queryClient.setQueryData(queryKey, data);
  }

  for (const [queryKey, data] of context.previousLists) {
    queryClient.setQueryData(queryKey, data);
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
      syncLikedMoverListCache(queryClient, moverId, true, data.likeCount);
      syncMoverListLikeCache(queryClient, moverId, true, data.likeCount);
    },
    onSettled: () => {
      invalidateLikedMoverLists(queryClient);
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
      syncLikedMoverListCache(queryClient, moverId, false, data.likeCount);
      syncMoverListLikeCache(queryClient, moverId, false, data.likeCount);
    },
    onSettled: () => {
      invalidateLikedMoverLists(queryClient);
    },
  });
}

/** 좋아요 목록 삭제 뮤테이션 */
export function useBulkDeleteLikesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLikes,
    onSuccess: () => {
      invalidateLikedMoverLists(queryClient);
    },
  });
}
