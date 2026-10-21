export const paymentKeys = {
  all: ['payment'] as const,
  byEstimate: (estimateId: string) =>
    [
      ...paymentKeys.all,
      'estimate',
      estimateId,
    ] as const /* 견적의 결제 현황 */,
};
