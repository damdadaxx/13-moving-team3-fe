// [메뉴] 헤더 모달 메뉴 > 마이페이지
// [페이지] 마이페이지
import { pageMetadata } from '@/lib/constants/site';

import MoverMypageContent from '@/components/features/mover/MoverMypage/MoverMypageContent';

export const generateMetadata = pageMetadata('mypage', '/mover/mypage');

export default async function MoverMypagePage() {
  return <MoverMypageContent />;
}
