// [레이아웃] 결제 성공
import type { ReactNode } from 'react';

import { pageMetadata } from '@/lib/constants/site';

export const generateMetadata = pageMetadata(
  'payment',
  '/customer/payments/success',
);

export default function PaymentSuccessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
