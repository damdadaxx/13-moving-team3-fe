import type { Locale } from 'next-intl';

/*
@ 카카오 JavaScript SDK
- 카카오톡 공유(Kakao.Share)에 사용한다
- JavaScript 키는 카카오 디벨로퍼스 앱 > 앱 키의 JavaScript 키
- SDK가 브라우저에서 초기화되므로 NEXT_PUBLIC_ 환경변수만 사용한다
*/

export const KAKAO_SDK_SRC =
  'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';

export const KAKAO_JAVASCRIPT_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? '';

/*
@ locale별 OG 이미지
- public/og/{locale}.png
- 메타데이터와 카카오 공유가 같은 경로를 쓴다
*/
export const OG_IMAGE_PATH_BY_LOCALE = {
  ko: '/og/ko.png',
  en: '/og/en.png',
  zh: '/og/zh.png',
  ja: '/og/ja.png',
} as const satisfies Record<Locale, string>;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function getOgImagePath(locale: Locale): string {
  return OG_IMAGE_PATH_BY_LOCALE[locale];
}
