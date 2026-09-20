// tanstack/react-query - estimate query keys
import type {
  MyEstimateListQuery,
  ReceivedRequestQuery,
} from '@/types/estimate';

export const estimateKeys = {
  all: ['estimate'] as const,
  activeRequest: () => [...estimateKeys.all, 'active-request'] as const,
  received: (query: ReceivedRequestQuery) =>
    [...estimateKeys.all, 'received', query] as const,
  list: (query: MyEstimateListQuery) =>
    [...estimateKeys.all, 'list', query] as const,
  detail: (estimateId: string) =>
    [...estimateKeys.all, 'detail', estimateId] as const,
};
