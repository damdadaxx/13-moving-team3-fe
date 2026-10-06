// [레이아웃] 받은 요청
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'moverRequests',
  '/mover/requests',
);

export default function MoverRequestsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
