// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 탭메뉴
// [페이지] 견적 상세
import { Metadata } from 'next';

import { OPEN_GRAPH_DEFAULT } from '@/lib/constants/site';

import MoverEstimateConfirmedDetailPageContent from '@/components/features/mover/EstimateConfirmedDetail/MoverEstimateConfirmedDetailPageContent';

interface MoverEstimateSentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoverEstimateSentDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: '견적 상세',
    openGraph: {
      ...OPEN_GRAPH_DEFAULT,
      url: `/mover/estimates/sent/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function MoverEstimateSentDetailPage({
  params,
}: MoverEstimateSentDetailPageProps) {
  const { id } = await params;

  return <MoverEstimateConfirmedDetailPageContent estimateId={id} />;
}
