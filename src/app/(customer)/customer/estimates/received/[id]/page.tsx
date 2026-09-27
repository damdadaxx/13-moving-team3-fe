// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// [페이지] 견적 상세 (받았던 견적)
import { Metadata } from 'next';

import { OPEN_GRAPH_DEFAULT } from '@/lib/constants/site';

import EstimateReceivedDetailPageContent from '@/components/customer/EstimateReceivedDetail/EstimateReceivedDetailPageContent';

interface EstimateReceivedDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EstimateReceivedDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: '견적 상세',
    openGraph: {
      ...OPEN_GRAPH_DEFAULT,
      url: `/customer/estimates/received/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function EstimateReceivedDetailPage({
  params,
}: EstimateReceivedDetailPageProps) {
  const { id } = await params;

  return <EstimateReceivedDetailPageContent estimateId={id} />;
}
