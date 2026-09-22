// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 상세
import type { Metadata } from 'next';

import { OPEN_GRAPH_DEFAULT } from '@/lib/constants/site';

import MoverDetailPageContent from '@/components/common/MoverDetail/MoverDetailPageContent';

interface MoverDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoverDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: '기사님 상세',
    openGraph: {
      ...OPEN_GRAPH_DEFAULT,
      url: `/mover/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function MoverDetailPage({
  params,
}: MoverDetailPageProps) {
  const { id } = await params;

  return <MoverDetailPageContent moverId={id} />;
}
