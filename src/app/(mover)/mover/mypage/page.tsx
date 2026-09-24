// [메뉴] 헤더 모달 메뉴 > 마이페이지
// [페이지] 마이페이지
import { Metadata } from 'next';

import { OPEN_GRAPH_DEFAULT } from '@/lib/constants/site';

import MoverMypageContent from '@/components/mover/MoverMypage/MoverMypageContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '마이페이지',
    openGraph: {
      ...OPEN_GRAPH_DEFAULT,
      url: `/mover/mypage`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function MoverMypagePage() {
  return <MoverMypageContent />;
}
