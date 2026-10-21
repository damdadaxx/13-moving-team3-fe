// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 > 견적 상세 > 결제
// [페이지] 결제 성공 (토스 successUrl로 돌아오는 곳)
import { PaymentSuccess } from '@/components/features/customer/Payment/PaymentResult';

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    estimateId?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { paymentKey, orderId, amount, estimateId } = await searchParams;

  return (
    <PaymentSuccess
      paymentKey={paymentKey}
      orderId={orderId}
      amount={amount}
      estimateId={estimateId}
    />
  );
}
