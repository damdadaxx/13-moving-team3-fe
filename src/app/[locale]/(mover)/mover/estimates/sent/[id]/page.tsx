// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 탭메뉴
// [페이지] 견적 상세
import { pageMetadata } from '@/lib/constants/site';

import MoverEstimateConfirmedDetailPageContent from '@/components/features/mover/EstimateConfirmedDetail/MoverEstimateConfirmedDetailPageContent';

interface MoverEstimateSentDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export const generateMetadata = pageMetadata(
  'estimateDetail',
  ({ id }) => `/mover/estimates/sent/${id}`,
);

export default async function MoverEstimateSentDetailPage({
  params,
}: MoverEstimateSentDetailPageProps) {
  const { id } = await params;

  return <MoverEstimateConfirmedDetailPageContent estimateId={id} />;
}
