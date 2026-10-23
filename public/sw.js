/*
@ 서비스 워커 (PWA)
- 하는 일은 하나다: 페이지 이동(navigate) 요청이 네트워크 오류로 실패하면 오프라인 안내 페이지를 보여준다
- API(/api), Supabase Realtime·Storage, 이미지, 스크립트는 건드리지 않는다.
  로그인 상태나 채팅 데이터가 오래된 캐시로 보이지 않게 하려고 일부러 캐시하지 않는다
- 오프라인 페이지를 바꾸면 CACHE 이름의 버전을 올려 이전 캐시를 정리한다
*/
const CACHE = 'moving-offline-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL)),
  );
});
