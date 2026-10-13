// [레이아웃] 기사님 프로필 최초 생성
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'moverProfileNew',
  '/mover/mypage/profile/new',
);

export default function MoverProfileNewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
