// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 > 견적 상세 > 결제
// [페이지] 결제 실패 (토스 failUrl로 돌아오는 곳)
import { PaymentFail } from '@/components/features/customer/Payment/PaymentResult';

interface PaymentFailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    estimateId?: string;
  }>;
}

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const { message, estimateId } = await searchParams;

  return <PaymentFail message={message} estimateId={estimateId} />;
}
