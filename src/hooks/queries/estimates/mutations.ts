import type {
  DesignatedEstimate,
  EstimateRequestDetail,
} from '@/types/estimate';
import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import {
  createDesignatedEstimate,
  updateEstimateStatus,
} from '@/lib/api/estimate';

import { estimateKeys } from '@/hooks/queries/estimates/keys';

/** 지정 기사님 캐시 추가 */
function addDesignatedMoverToCache(
  queryClient: QueryClient,
  moverId: string,
  data?: DesignatedEstimate,
) {
  /** 활성 견적 요청 캐시 업데이트 */
  queryClient.setQueryData<EstimateRequestDetail | null>(
    estimateKeys.activeRequest(),
    (current) => {
      if (!current) return current;

      const alreadyRequested = current.estimates.some((estimate) => {
        const estimateMoverId = estimate.mover.userId ?? estimate.mover.moverId;
        return estimateMoverId === moverId;
      });
      if (alreadyRequested) return current;

      return {
        ...current,
        estimates: [
          ...current.estimates,
          {
            id: data?.id,
            isDesignated: true,
            status: 'DESIGNATED',
            mover: {
              userId: data?.mover.userId ?? moverId,
              nickname: data?.mover.nickname ?? '',
            },
          },
        ],
      };
    },
  );
}

/**
 * @ 지정 기사님 견적 요청 생성 뮤테이션
 * - 지정 기사님 견적 요청을 생성하고 캐시를 업데이트한다
 */
export function useCreateDesignatedEstimateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    /** 지정 기사님 견적 요청 생성 */
    mutationFn: ({
      estimateRequestId,
      moverId,
    }: {
      estimateRequestId: string;
      moverId: string;
    }) => createDesignatedEstimate(estimateRequestId, moverId),
    onSuccess: (data, { moverId }) => {
      addDesignatedMoverToCache(queryClient, moverId, data);
    },
  });
}

/**
 * @ 견적 확정 뮤테이션
 * - PATCH /estimates/{estimateId}, status: 'ACCEPTED'
 * - 확정하면 같은 요청의 나머지 PROPOSED 견적은 NOT_SELECTED로 바뀐다
 * - 성공하면 이 견적의 상세 캐시를 무효화해 확정 상태를 다시 받아온다
 */
export function useConfirmEstimateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estimateId: string) =>
      updateEstimateStatus(estimateId, { status: 'ACCEPTED' }),
    onSuccess: (_data, estimateId) => {
      queryClient.invalidateQueries({
        queryKey: estimateKeys.detail(estimateId),
      });
    },
  });
}
