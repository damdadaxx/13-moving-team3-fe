// [레이아웃] 기사님 찾기·기사님 상세
// 기사님 계정은 이 구간에 들어오지 못한다
import MoverBrowseGuard from '@/lib/providers/MoverBrowseGuard';

export default function MoverBrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MoverBrowseGuard>{children}</MoverBrowseGuard>;
}
