/*
@ 요청별 i18n 설정
- locale 결정과 검증은 레이아웃이 아니라 여기서 한다
- getTranslations({ locale })처럼 locale을 직접 넘기면 그 값을 쓰고,
  없으면 [locale] 루트 파라미터를 읽어 지원하는 locale인지 확인한다
- 메시지는 프로젝트 루트의 messages/{locale}.json에서 불러온다
*/
import * as rootParams from 'next/root-params';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
