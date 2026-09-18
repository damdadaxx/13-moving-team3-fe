// tanstack/react-query - estimate query keys

export const estimateKeys = {
  all: ['estimates'] as const,
  activeRequest: () => [...estimateKeys.all, 'activeRequest'] as const,
};
