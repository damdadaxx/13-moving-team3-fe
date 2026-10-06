'use client';

import { useEffect } from 'react';

import {
  type Locale,
  type Messages,
  NextIntlClientProvider,
  useTranslations,
} from 'next-intl';
import { usePathname } from 'next/navigation';

// root layout 에러 최후 보루
// app/[locale]/layout.tsx(루트 레이아웃) 자체가 에러났을 때만 동작

import { pretendard } from '@/lib/constants/fonts';
import { splitLocalePrefix } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import EmptyState from '@/components/ui/EmptyState';

import en from '../../messages/en.json';
import ja from '../../messages/ja.json';
import ko from '../../messages/ko.json';
import zh from '../../messages/zh.json';
import './globals.css';

/*
@ 레이아웃 밖이라 번역 Provider 를 직접 감싼다
- 레이아웃의 NextIntlClientProvider 가 없으면 버튼(ButtonElement) 등의 번역 훅이 에러를 낸다
- locale 은 현재 주소의 접두사로 정하고, 없으면 한국어(ko)
- Record<Locale, Messages> 라서 en/zh/ja.json 에 ko.json 의 키가 빠지면 타입 에러가 난다 (번역 누락 검사 겸용)
*/
const MESSAGES: Record<Locale, Messages> = { ko, en, zh, ja };

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const pathname = usePathname();
  const locale = splitLocalePrefix(pathname ?? '/').locale ?? 'ko';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang={locale}
      className={cn(pretendard.variable, 'h-full antialiased')}
    >
      <body className="h-full">
        <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
          <GlobalErrorContent onReset={reset} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function GlobalErrorContent({ onReset }: { onReset: () => void }) {
  const t = useTranslations('GlobalError');

  return (
    <EmptyState
      as="main"
      message={t('message')}
      buttonLabel={t('reload')}
      onClick={onReset}
      isFullViewport
    />
  );
}
