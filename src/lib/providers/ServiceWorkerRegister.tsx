'use client';

import { useEffect } from 'react';

/*
@ PWA 서비스 워커 등록
- public/sw.js를 등록한다. 하는 일은 오프라인일 때 안내 페이지를 보여주는 것뿐이다
- 개발 서버에서는 등록하지 않는다. 서비스 워커가 남아 있으면 Fast Refresh와 캐시가 꼬이기 쉽다
  (확인할 때는 npm run build && npm start 로 운영 모드에서 본다)
*/
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    void navigator.serviceWorker.register('/sw.js', { scope: '/' });
  }, []);

  return null;
}
