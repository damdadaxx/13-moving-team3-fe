/*
@ Sentry 브라우저 초기화
- Next.js가 앱이 뜨기 전에 브라우저에서 자동으로 실행하는 파일이다 (직접 import 하지 않는다)
- NEXT_PUBLIC_SENTRY_DSN이 없으면(로컬 등) SDK가 아무것도 보내지 않는다
- API 요청은 같은 출처의 /api 프록시라 별도 tracePropagationTargets 없이 추적 헤더가 붙는다
*/
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [Sentry.replayIntegration()],
  // ponytail: 운영에서 모든 요청을 추적하면 할당량을 빨리 쓴다. 트래픽이 늘면 더 낮춘다
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // 세션 리플레이: 일반 세션 10%, 에러가 난 세션은 전부
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// 클라이언트 페이지 이동을 트레이스로 기록한다
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
