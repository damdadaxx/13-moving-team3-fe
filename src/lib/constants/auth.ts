/*
@ 인증 쿠키
- 백엔드 authConstants.ts의 ACCESS_TOKEN_COOKIE / REFRESH_TOKEN_COOKIE와 동일해야 한다
- httpOnly라 클라이언트 JS에서는 읽지 못하고, 서버(layout, 프록시)에서만 존재 여부를 본다
*/
export const ACCESS_TOKEN_COOKIE = 'accessToken';

/*
@ refreshToken 쿠키
- 수명 7일. accessToken(15분)이 만료돼 브라우저가 지워도 이 쿠키는 남는다
- 백엔드 Path=/auth 를 프록시가 Path=/api/auth 로 바꿔 내려주므로
  /api/auth/* 요청(= /api/auth/me 포함)에만 실린다. 일반 페이지 요청에는 실리지 않는다
*/
export const REFRESH_TOKEN_COOKIE = 'refreshToken';
