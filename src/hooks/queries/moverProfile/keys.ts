export const moverProfileKeys = {
  all: ['moverProfile'] as const,
  detail: () => [...moverProfileKeys.all, 'detail'] as const,
};
