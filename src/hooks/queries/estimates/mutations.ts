import type {
  DesignatedEstimate,
  EstimateRequestDetail,
} from '@/types/estimate';
import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { createDesignatedEstimate } from '@/lib/api/estimate';

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
            id: data?.id ?? '',
            price: null,
            comment: null,
            isDesignated: true,
            status: 'DESIGNATED',
            rejectReason: null,
            mover: {
              userId: data?.mover.userId ?? moverId,
              nickname: data?.mover.nickname ?? '',
              imgUrl: null,
              careerMonths: 0,
              user: data?.mover.user ?? { name: '' },
              reviewCount: 0,
              averageRating: null,
              confirmedEstimateCount: 0,
              likeCount: 0,
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
