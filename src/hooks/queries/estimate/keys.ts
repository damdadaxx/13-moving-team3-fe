// tanstack/react-query - estimate query keys
import type { GetEstimatesParams } from '@/types/estimate';

export const estimateKeys = {
  all: ['estimate'] as const,
  activeRequest: () => [...estimateKeys.all, 'active-request'] as const,
  lists: () => [...estimateKeys.all, 'list'] as const,
  list: (params: GetEstimatesParams) =>
    [...estimateKeys.lists(), params] as const,
};
