// [레이아웃] 기사님 프로필 수정
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'profileEdit',
  '/mover/mypage/profile/edit',
);

export default function MoverProfileEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
