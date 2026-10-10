// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 찾기
import { pageMetadata } from '@/lib/constants/site';

import MoverFindContent from '@/components/features/common/Mover/MoverFindContent';

export const generateMetadata = pageMetadata('moverFind', '/mover');

export default function MoverPage() {
  return <MoverFindContent />;
}
