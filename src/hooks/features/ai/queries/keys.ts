export const aiKeys = {
  all: ['ai'] as const,
  usage: () => [...aiKeys.all, 'usage'] as const /** 오늘 남은 AI 사용 횟수 */,
};
