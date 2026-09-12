/*
@ 역할 타입
- 'customer': 일반 유저
- 'mover': 기사님
- 백엔드 enum은 CUSTOMER | MOVER. API 경계에서 toFrontendRole / toBackendRole 로 변환
*/
export type Role = 'customer' | 'mover';

/*
@ 세션이 없을 때까지 포함한 역할
- 헤더 메뉴, AuthGuard allow 등 비회원/고객/기사 분기
*/
export type AuthVariant = 'guest' | Role;
