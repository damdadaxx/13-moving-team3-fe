/*
@ i18n 전용 proxy (Next.js 16의 middleware)
- 요청 경로에 맞는 locale을 찾아 [locale] 라우트로 연결한다
  /customer/...    → ko (접두사 없이 기존 URL 그대로, localePrefix: 'as-needed')
  /en/customer/... → en
- 이 파일이 없으면 /customer가 [locale]="customer"로 매칭돼 전부 404가 된다
- 인증 가드는 여기서 하지 않는다 (AuthProvider + 라우트 그룹 layout 담당)
- matcher: API 프록시(/api), Next 내부 경로(_next, _vercel), 확장자가 있는 파일(robots.txt 등)은 제외
*/
import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
