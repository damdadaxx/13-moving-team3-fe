export const reviewKeys = {
  all: ['reviews'] as const /** 모든 리뷰 */,
  byMover: (moverId: string, query?: object) =>
    [
      ...reviewKeys.all,
      'mover',
      moverId,
      query,
    ] as const /** 기사님별 리뷰(검색 조건) */,
};
