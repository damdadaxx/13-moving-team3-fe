/*
@ Sentry 서버·edge 초기화
- Next.js가 서버(nodejs)와 edge(proxy.ts) 런타임이 시작될 때 register()를 자동으로 호출한다
- 두 런타임의 설정이 같아서 파일을 나누지 않고 여기서 한 번에 초기화한다
- DSN은 브라우저와 같은 NEXT_PUBLIC_SENTRY_DSN을 쓴다 (DSN은 공개돼도 되는 값). 없으면 아무것도 보내지 않는다
*/
import * as Sentry from '@sentry/nextjs';

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      // ponytail: 운영에서 모든 요청을 추적하면 할당량을 빨리 쓴다. 트래픽이 늘면 더 낮춘다
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });
  }
}

// 서버 컴포넌트·라우트 핸들러·proxy에서 난 요청 에러를 Sentry로 보낸다
export const onRequestError = Sentry.captureRequestError;
