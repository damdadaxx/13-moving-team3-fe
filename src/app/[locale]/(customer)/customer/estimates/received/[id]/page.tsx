// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// [페이지] 견적 상세 (받았던 견적)
import { pageMetadata } from '@/lib/constants/site';

import EstimateReceivedDetailPageContent from '@/components/features/customer/EstimateReceivedDetail/EstimateReceivedDetailPageContent';

interface EstimateReceivedDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export const generateMetadata = pageMetadata(
  'estimateDetail',
  ({ id }) => `/customer/estimates/received/${id}`,
);

export default async function EstimateReceivedDetailPage({
  params,
}: EstimateReceivedDetailPageProps) {
  const { id } = await params;

  return <EstimateReceivedDetailPageContent estimateId={id} />;
}
