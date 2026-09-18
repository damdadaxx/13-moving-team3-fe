export const likeKeys = {
  all: ['likes'] as const,
  mine: () => [...likeKeys.all, 'me'] as const,
};
