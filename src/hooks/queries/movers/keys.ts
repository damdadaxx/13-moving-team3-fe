export const moverKeys = {
  all: ['movers'] as const /** 모든 기사님 */,
  lists: () => [...moverKeys.all, 'list'] as const /** 기사님 목록 */,
  list: (query?: object) =>
    [...moverKeys.lists(), query] as const /** 기사님 목록 쿼리(검색 조건) */,
  detail: (id: string) =>
    [...moverKeys.all, 'detail', id] as const /** 기사님 상세 */,
};
