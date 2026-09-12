/*
@ 인증 쿠키
- 백엔드 authConstants.ts의 ACCESS_TOKEN_COOKIE와 동일해야 한다
- httpOnly라 클라이언트 JS에서는 읽지 못하고, 서버(layout, 프록시)에서만 존재 여부를 본다
*/
export const ACCESS_TOKEN_COOKIE = 'accessToken';
