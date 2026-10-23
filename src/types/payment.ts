/*
@ 결제 관련 타입 (토스페이먼츠 결제창 v2)
- 흐름: 견적 확정 → 선수금(견적가의 10%) 결제 → 이사 완료 후 "이사 확정" → 잔금 결제
- 금액은 항상 서버가 견적가에서 계산한다. 프런트는 서버가 준 금액만 그대로 쓴다
- 백엔드 결제 API 계약과 이름·단위를 맞춘다
*/
import type { ServiceType } from '@/types/serviceType';

/** 선수금 / 잔금 */
export type PaymentType = 'DEPOSIT' | 'BALANCE';

export type PaymentStatus = 'READY' | 'PAID' | 'CANCELED' | 'FAILED';

export interface PaymentInfo {
  paymentId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
  /** 토스가 승인을 거절한 사유. 실패(FAILED)가 아니면 null */
  failureMessage: string | null;
}

/** GET /estimates/:estimateId/payments */
export interface EstimatePayments {
  estimateId: string;
  price: number;
  depositAmount: number;
  balanceAmount: number;
  deposit: PaymentInfo | null;
  balance: PaymentInfo | null;
  /** 견적이 확정(ACCEPTED)됐고 선수금이 아직 결제되지 않았다 */
  canPayDeposit: boolean;
  /** 선수금이 결제됐고 이사가 완료(COMPLETED)됐으며 잔금이 아직 결제되지 않았다 */
  canPayBalance: boolean;
  /** 잔금까지 결제 완료 */
  isSettled: boolean;
}

/** POST /estimates/:estimateId/payments 응답 - 결제창에 넘길 주문 정보 */
export interface PaymentOrder {
  orderId: string;
  orderName: string;
  amount: number;
  /** 토스 customerKey. 사용자 id(uuid)다 */
  customerKey: string;
  customerName: string;
}

/** POST /payments/confirm 요청 - 결제창 성공 후 successUrl 쿼리로 돌아온 값 */
export interface ConfirmPaymentInput {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/** POST /payments/confirm 응답 */
export interface ConfirmedPayment {
  paymentId: string;
  estimateId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
}

/*
@ GET /payments - 내 결제내역 (커서 기반 무한 스크롤, 최신 결제순)
- 기본은 결제 완료(PAID) 건만 내려온다
*/
export interface PaymentHistoryEstimate {
  estimateId: string;
  serviceType: ServiceType;
  moveDate: string;
  departureAddress: string;
  arrivalAddress: string;
  /** 견적가 (선수금 + 잔금) */
  price: number;
  mover: { moverId: string; nickname: string };
}

export interface PaymentHistoryItem {
  paymentId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
  failureMessage: string | null;
  orderName: string;
  estimate: PaymentHistoryEstimate;
}

export interface PaymentHistoryList {
  list: PaymentHistoryItem[];
  nextCursor: string | null;
  /** 조건에 맞는 전체 결제 건수 */
  totalCount: number;
}

export interface PaymentHistoryQuery {
  cursor?: string;
  size?: number;
}
