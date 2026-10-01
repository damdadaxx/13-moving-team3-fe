import type { MoverListQuery } from '@/types/mover';

export const moverKeys = {
  all: ['mover'] as const,
  lists: () => [...moverKeys.all, 'list'] as const,
  list: (params: Omit<MoverListQuery, 'cursor'>) =>
    [...moverKeys.lists(), params] as const,
  liked: (size: number) => [...moverKeys.all, 'liked', size] as const,
  detail: (id: string) =>
    [...moverKeys.all, 'detail', id] as const /** 기사님 상세 */,
};

export const moverProfileKeys = {
  all: ['moverProfile'] as const,
  detail: () => [...moverProfileKeys.all, 'detail'] as const,
};
