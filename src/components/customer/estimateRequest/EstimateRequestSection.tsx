// 견적요청 페이지 본문
//
// 세 가지 상태로 갈린다.
// 1) 프로필 없음  - 견적 요청이 프로필을 참조하므로 등록부터 해야 한다 (백엔드도 404로 막는다)
// 2) 진행 중 요청 - 고객당 1건이라 새 요청을 받지 않는다 (백엔드도 409로 막는다)
// 3) 그 외        - 견적 요청 폼
'use client';

import { useCustomerProfileQuery } from '@/hooks/queries/customer/queries';
import { useActiveEstimateRequestQuery } from '@/hooks/queries/estimate/queries';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

import EstimateRequestForm from './EstimateRequestForm';
import EstimateRequestInProgress from './EstimateRequestInProgress';
import ProfileRequiredNotice from './ProfileRequiredNotice';

export default function EstimateRequestSection() {
  const profileQuery = useCustomerProfileQuery();
  const activeQuery = useActiveEstimateRequestQuery();

  if (profileQuery.isPending || activeQuery.isPending) {
    return <LoadingDisplay />;
  }

  /* 조회에 실패했으면 폼을 열어 헛수고시키지 않고 진행 중 화면으로 보낸다.
     (요청이 있는데 못 읽은 것일 수 있어, 새 요청을 권하는 쪽이 더 위험하다) */
  if (profileQuery.isError || activeQuery.isError) {
    return <EstimateRequestInProgress />;
  }

  if (!profileQuery.data) return <ProfileRequiredNotice />;
  if (activeQuery.data) return <EstimateRequestInProgress />;

  return <EstimateRequestForm />;
}
