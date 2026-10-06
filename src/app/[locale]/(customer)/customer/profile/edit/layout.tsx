// [레이아웃] 프로필 수정
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'profileEdit',
  '/customer/profile/edit',
);

export default function CustomerProfileEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
