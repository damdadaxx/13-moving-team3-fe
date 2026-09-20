// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 상세
import MoverDetailPageContent from '@/components/common/MoverDetail/MoverDetailPageContent';

interface MoverDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MoverDetailPage({
  params,
}: MoverDetailPageProps) {
  const { id } = await params;

  return <MoverDetailPageContent moverId={id} />;
}
