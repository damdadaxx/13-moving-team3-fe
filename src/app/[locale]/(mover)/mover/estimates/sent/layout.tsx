// [레이아웃] 보낸 견적 조회
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesSent',
  '/mover/estimates/sent',
);

export default function MoverEstimateSentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
