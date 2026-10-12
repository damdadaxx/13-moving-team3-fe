// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 상세
import { pageMetadata } from '@/lib/constants/site';

import MoverDetailPageContent from '@/components/features/common/MoverDetail/MoverDetailPageContent';

interface MoverDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export const generateMetadata = pageMetadata(
  'moverDetail',
  ({ id }) => `/mover/${id}`,
);

export default async function MoverDetailPage({
  params,
}: MoverDetailPageProps) {
  const { id } = await params;

  return <MoverDetailPageContent moverId={id} />;
}
