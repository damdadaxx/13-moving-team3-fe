export const estimateKeys = {
  all: ['estimates'] as const /** 모든 견적 요청 */,
  activeRequest: () =>
    [...estimateKeys.all, 'active-request'] as const /** 활성 견적 요청 */,
};
