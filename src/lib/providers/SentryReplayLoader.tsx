'use client';

// Sentry Replay(rrweb, 50~60KB)를 초기 로드/TBT와 분리해서 붙인다.
// instrumentation-client.ts 안에서 lazyLoadIntegration을 쓰면 Next.js가 루트 번들에
// 그대로 묶어버려서 효과가 없었다 (실측 확인). 일반 클라이언트 컴포넌트의 동적 import는
// Next.js router 레벨 코드 스플리팅을 타므로 여기서 마운트 후에 붙인다.
import { useEffect } from 'react';

export default function SentryReplayLoader() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

    const load = async () => {
      const Sentry = await import('@sentry/nextjs');
      // Strict Mode·재마운트로 effect가 두 번 돌아도 Replay는 한 번만 등록한다
      if (Sentry.getClient()?.getIntegrationByName('Replay')) return;
      const replayIntegration =
        await Sentry.lazyLoadIntegration('replayIntegration');
      Sentry.addIntegration(replayIntegration());
    };

    // 초기 렌더링이 끝난 뒤 대기 시간에 붙인다 (requestIdleCallback 미지원 브라우저는 timeout)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load);
      return () => window.cancelIdleCallback(id);
    }

    const timeoutId = setTimeout(load, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
