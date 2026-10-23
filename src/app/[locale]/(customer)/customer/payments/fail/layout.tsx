// [레이아웃] 결제 실패
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'payment',
  '/customer/payments/fail',
);

export default function PaymentFailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
