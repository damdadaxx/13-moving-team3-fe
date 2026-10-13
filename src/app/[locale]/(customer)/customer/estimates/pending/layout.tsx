// [레이아웃] 대기중인 견적
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesPending',
  '/customer/estimates/pending',
);

export default function EstimatePendingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
