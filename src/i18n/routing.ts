/*
@ i18n 라우팅 설정
- locale 목록과 기본 locale을 정의한다
- localePrefix: 'as-needed' → 기본 locale(ko)은 접두사 없이 기존 URL 그대로 유지된다
  /customer/estimates      → 한국어 (기존 URL 그대로)
  /en/customer/estimates   → 영어
- 'always'로 바꾸면 기존 URL이 전부 /ko/... 로 바뀌어 공유 링크·북마크·검색 인덱스가 깨진다
*/
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed',
});
