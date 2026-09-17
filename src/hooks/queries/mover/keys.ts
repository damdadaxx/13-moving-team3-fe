import type { MoverListParams } from '@/types/mover';

export const moverKeys = {
  all: ['mover'] as const,
  lists: () => [...moverKeys.all, 'list'] as const,
  list: (params: Omit<MoverListParams, 'cursor'>) =>
    [...moverKeys.lists(), params] as const,
  liked: (size: number) => [...moverKeys.all, 'liked', size] as const,
};
