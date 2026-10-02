/*
@ next-intl 전역 타입 등록
- 지원 locale을 'ko' | 'en' | 'zh' | 'ja' 타입으로 등록한다 (routing.locales 기준)
- import type { Locale } from 'next-intl' 로 어디서든 쓸 수 있고, useLocale()도 이 타입을 반환한다
*/
import { routing } from '@/i18n/routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
