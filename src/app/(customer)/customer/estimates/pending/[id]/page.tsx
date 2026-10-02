// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 견적 상세 (대기중인 견적)
import { Metadata } from 'next';

import { OPEN_GRAPH_DEFAULT } from '@/lib/constants/site';

import EstimatePendingDetailPageContent from '@/components/features/customer/EstimatePendingDetail/EstimatePendingDetailPageContent';

interface EstimatePendingDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EstimatePendingDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: '견적 상세',
    openGraph: {
      ...OPEN_GRAPH_DEFAULT,
      url: `/customer/estimates/pending/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function EstimatePendingDetailPage({
  params,
}: EstimatePendingDetailPageProps) {
  const { id } = await params;

  return <EstimatePendingDetailPageContent estimateId={id} />;
}
