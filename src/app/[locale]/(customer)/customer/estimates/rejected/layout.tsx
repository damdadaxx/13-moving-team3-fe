// [레이아웃] 반려된 요청
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesRejected',
  '/customer/estimates/rejected',
);

export default function EstimateRejectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
