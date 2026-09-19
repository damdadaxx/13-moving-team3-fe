/*
@ 카카오 JavaScript SDK
- 카카오톡 공유(Kakao.Share)에 사용한다
- JavaScript 키는 카카오 디벨로퍼스 앱 > 앱 키의 JavaScript 키
*/

export const KAKAO_SDK_SRC =
  'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';

export const KAKAO_JAVASCRIPT_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? '';

export const OG_IMAGE_PATH = '/opengraph-image.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
