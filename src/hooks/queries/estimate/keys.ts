// tanstack/react-query - estimate query keys
import type {
  GetEstimatesParams,
  MyEstimateListQuery,
  ReceivedRequestQuery,
} from '@/types/estimate';

export const estimateKeys = {
  all: ['estimate'] as const,
  activeRequest: () => [...estimateKeys.all, 'active-request'] as const,
  received: (query: ReceivedRequestQuery) =>
    [...estimateKeys.all, 'received', query] as const,
  lists: () => [...estimateKeys.all, 'list'] as const,
  list: (query: MyEstimateListQuery | GetEstimatesParams) =>
    [...estimateKeys.lists(), query] as const,
  detail: (estimateId: string) =>
    [...estimateKeys.all, 'detail', estimateId] as const,
};
