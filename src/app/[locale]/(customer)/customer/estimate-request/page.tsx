// [메뉴] 견적 요청 메뉴
// [페이지] 견적 요청 페이지
import { pageMetadata } from '@/lib/constants/site';

import EstimateRequestSection from '@/components/features/customer/EstimateRequest/EstimateRequestSection';

export const generateMetadata = pageMetadata(
  'estimateRequest',
  '/customer/estimate-request',
);

export default function EstimateRequestPage() {
  return <EstimateRequestSection />;
}
