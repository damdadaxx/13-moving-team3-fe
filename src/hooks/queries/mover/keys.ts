import type { MoverListQuery } from '@/types/mover';

export const moverKeys = {
  all: ['mover'] as const,
  profile: () => [...moverKeys.all, 'profile'] as const,
  lists: () => [...moverKeys.all, 'list'] as const,
  list: (params: Omit<MoverListQuery, 'cursor'>) =>
    [...moverKeys.lists(), params] as const,
  liked: (size: number) => [...moverKeys.all, 'liked', size] as const,
};
