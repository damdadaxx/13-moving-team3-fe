export const likeKeys = {
  all: ['likes'] as const,
  byMover: (moverId: string) =>
    [...likeKeys.all, 'mover', moverId] as const /** 기사님별 좋아요 */,
  mine: () => [...likeKeys.all, 'me'] as const /** 모든 좋아요 */,
};
