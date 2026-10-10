// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 견적 상세 (대기중인 견적)
import { pageMetadata } from '@/lib/constants/site';

import EstimatePendingDetailPageContent from '@/components/features/customer/EstimatePendingDetail/EstimatePendingDetailPageContent';

interface EstimatePendingDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export const generateMetadata = pageMetadata(
  'estimateDetail',
  ({ id }) => `/customer/estimates/pending/${id}`,
);

export default async function EstimatePendingDetailPage({
  params,
}: EstimatePendingDetailPageProps) {
  const { id } = await params;

  return <EstimatePendingDetailPageContent estimateId={id} />;
}
