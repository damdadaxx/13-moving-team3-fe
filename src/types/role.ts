/*
@ 역할 타입
- 'customer': 일반 유저
- 'mover': 기사님
- 백엔드 enum은 CUSTOMER | MOVER. API 경계에서 toFrontendRole / toBackendRole 로 변환
*/
export type Role = 'customer' | 'mover';
