// [메뉴] 헤더 모달 메뉴 > 마이페이지
// [페이지] 마이페이지
import { Metadata } from 'next';

import { createPageMetadata } from '@/lib/constants/site';

import MoverMypageContent from '@/components/features/mover/MoverMypage/MoverMypageContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata(locale, {
    title: '마이페이지',
    path: `/mover/mypage`,
  });
}

export default async function MoverMypagePage() {
  return <MoverMypageContent />;
}
