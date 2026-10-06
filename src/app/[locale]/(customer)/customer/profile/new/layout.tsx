// [레이아웃] 프로필 최초 생성
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'profileNew',
  '/customer/profile/new',
);

export default function CustomerProfileNewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
