// [레이아웃] 받았던 견적
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesReceived',
  '/customer/estimates/received',
);

export default function EstimateReceivedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
