// tanstack/react-query - customer query keys
export const customerKeys = {
  all: ['customer'] as const,
  profile: () => [...customerKeys.all, 'profile'] as const,
};
