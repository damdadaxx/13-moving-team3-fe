export const reviewKeys = {
  all: ['reviews'] as const,
  mine: () => [...reviewKeys.all, 'me'] as const,
  pending: (page: number, pageSize: number) =>
    [...reviewKeys.mine(), 'pending', page, pageSize] as const,
  completed: (page: number, pageSize: number) =>
    [...reviewKeys.mine(), 'completed', page, pageSize] as const,
};
