// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// [페이지] 견적 상세 (받았던 견적)
import { Metadata } from 'next';

import { createPageMetadata } from '@/lib/constants/site';

import EstimateReceivedDetailPageContent from '@/components/features/customer/EstimateReceivedDetail/EstimateReceivedDetailPageContent';

interface EstimateReceivedDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: EstimateReceivedDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;

  return createPageMetadata(locale, {
    title: '견적 상세',
    path: `/customer/estimates/received/${id}`,
  });
}

export default async function EstimateReceivedDetailPage({
  params,
}: EstimateReceivedDetailPageProps) {
  const { id } = await params;

  return <EstimateReceivedDetailPageContent estimateId={id} />;
}
