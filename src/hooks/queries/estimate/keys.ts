import type { ReceivedRequestQuery } from '@/types/estimate';

export const estimateKeys = {
  all: ['estimates'] as const,
  received: (query: ReceivedRequestQuery) =>
    [...estimateKeys.all, 'received', query] as const,
};
