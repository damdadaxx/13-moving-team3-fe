// tanstack/react-query - estimate query keys
export const estimateKeys = {
  all: ['estimate'] as const,
  activeRequest: () => [...estimateKeys.all, 'active-request'] as const,
};
