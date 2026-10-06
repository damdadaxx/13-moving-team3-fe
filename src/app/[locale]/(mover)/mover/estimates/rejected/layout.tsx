// [레이아웃] 반려 요청
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesRejected',
  '/mover/estimates/rejected',
);

export default function MoverEstimateRejectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
