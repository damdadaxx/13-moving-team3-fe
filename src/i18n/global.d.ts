/*
@ next-intl 전역 타입 등록
- Locale: 지원 locale을 'ko' | 'en' | 'zh' | 'ja' 타입으로 등록한다 (routing.locales 기준)
  import type { Locale } from 'next-intl' 로 어디서든 쓸 수 있고, useLocale()도 이 타입을 반환한다
- Messages: messages/ko.json 구조를 기준 타입으로 등록한다
  t('없는키')처럼 오타나 누락된 번역 키를 쓰면 타입 에러가 난다
  → 키를 추가할 때는 ko.json에 먼저 넣고, en/zh/ja.json에도 같은 키를 채운다
*/
import { routing } from '@/i18n/routing';

import messages from '../../messages/ko.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
