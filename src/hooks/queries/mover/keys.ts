export const moverKeys = {
  all: ['mover'] as const,
  profile: () => [...moverKeys.all, 'profile'] as const,
};
