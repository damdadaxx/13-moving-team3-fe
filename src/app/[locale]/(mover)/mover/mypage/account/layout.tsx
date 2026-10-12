// [레이아웃] 기본 정보 수정
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'accountEdit',
  '/mover/mypage/account',
);

export default function MoverAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
