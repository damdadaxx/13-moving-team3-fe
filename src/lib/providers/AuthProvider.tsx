// 인증 상태 전역 Provider

'use client';

/*
@ TODO: 인증 가드
- 로그인 여부 / 역할(customer | mover) 조회 후 라우트 그룹 layout에서 리다이렉트
- (auth): 비로그인 전용. 로그인 사용자는 진입 불가
- (customer): 일반 유저 로그인 필요
- (mover): 기사님 로그인 필요
- (public): 비회원·일반 유저 모두 접근 가능 (따로 가드 불필요)
*/

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
