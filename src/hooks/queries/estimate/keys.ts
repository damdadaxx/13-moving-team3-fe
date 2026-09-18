// tanstack/react-query - estimate query keys
import type { ReceivedRequestQuery } from '@/types/estimate';

export const estimateKeys = {
  all: ['estimate'] as const,
  activeRequest: () => [...estimateKeys.all, 'active-request'] as const,
  received: (query: ReceivedRequestQuery) =>
    [...estimateKeys.all, 'received', query] as const,
};
