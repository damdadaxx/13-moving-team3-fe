export const likeKeys = {
  all: ['likes'] as const,
  mine: () => [...likeKeys.all, 'me'] as const,
  byMover: (moverId: string) => [...likeKeys.all, 'mover', moverId] as const,
};
