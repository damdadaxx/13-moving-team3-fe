// [레이아웃] 결제내역
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'estimatesPayments',
  '/customer/estimates/payments',
);

export default function EstimatePaymentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
