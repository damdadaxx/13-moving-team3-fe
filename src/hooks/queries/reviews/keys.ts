export const reviewKeys = {
  all: ['reviews'] as const /** 모든 리뷰 */,
  byMover: (moverId: string, query?: object) =>
    [
      ...reviewKeys.all,
      'mover',
      moverId,
      query,
    ] as const /** 기사님별 리뷰(검색 조건) */,
  mine: () => [...reviewKeys.all, 'me'] as const,
<<<<<<< HEAD
  pending: (page: number, pageSize: number) =>
    [...reviewKeys.mine(), 'pending', page, pageSize] as const,
=======
>>>>>>> b62aee0 (feat: 리뷰작성완료 목록)
  completed: (page: number, pageSize: number) =>
    [...reviewKeys.mine(), 'completed', page, pageSize] as const,
};
