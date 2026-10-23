import type { MetadataRoute } from 'next';

/*
@ PWA 웹 앱 매니페스트 (/manifest.webmanifest)
- 홈 화면에 설치할 때 쓰는 이름·아이콘·색을 정한다
- 아이콘은 public/icons (any: 흰 배경 + 주황 마크, maskable: 주황 배경 + 흰 마크)
- theme_color는 설치된 앱의 상단 바 색이다. 브라우저 탭의 색은 layout의 viewport.themeColor가 정한다
- start_url은 접두사 없는 기본 언어(ko) 경로다. 언어는 접속 후 next-intl이 정한다
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: '무빙 - 이사 견적 비교',
    short_name: '무빙',
    description: '이사 견적을 비교하고 확정하는 이사 매칭 플랫폼',
    lang: 'ko',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f9502e',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
