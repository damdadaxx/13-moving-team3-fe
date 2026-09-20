/*
@ 고객 프로필 Query Key
- all은 고객 프로필 관련 캐시의 공통 시작점이다.
- detail은 현재 로그인한 고객 한 명의 프로필 조회에 사용한다.
- Proxy/clientFetch 병합 후 queries.ts와 mutations.ts가 이 key를 재사용한다.
*/
export const customerProfileKeys = {
  all: ['customerProfile'] as const,
  detail: () => [...customerProfileKeys.all, 'detail'] as const,
};
