import type { ReactNode } from 'react';

import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';

import '@/app/globals.css';
import Providers from '@/app/providers';

import { ACCESS_TOKEN_COOKIE } from '@/lib/constants/auth';
import { pretendard } from '@/lib/constants/fonts';
import { SITE_URL, getOpenGraph } from '@/lib/constants/site';
import KakaoScript from '@/lib/providers/KakaoScript';

import { cn } from '@/utils/cn';

import Header from '@/components/ui/Header/Header';
import PageHeader from '@/components/ui/PageHeader';
import TopButton from '@/components/ui/TopButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Metadata');

  return {
    metadataBase: new URL(SITE_URL),
    title: t('siteTitle'),
    description: t('siteDescription'),
    openGraph: await getOpenGraph(locale, '/'),
  };
}

/*
@ 지원하는 locale 목록을 빌드 타임에 알려준다 (정적 렌더링용)
*/
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/*
@ 루트 레이아웃 ([locale] 하위)
- <html lang>에 locale이 필요해서 app/layout.tsx가 아니라 여기가 루트 레이아웃이다
- locale 검증·메시지 로딩은 src/i18n/request.ts에서 한다
- Providers가 'use client'라서 NextIntlClientProvider는 그 바깥(서버 컴포넌트)에 둔다
  (서버에서 렌더링될 때만 request.ts 설정을 자동으로 이어받는다)
*/
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const hasSessionCookie = cookieStore.has(ACCESS_TOKEN_COOKIE);

  return (
    <html
      lang={locale}
      className={cn(pretendard.variable, 'h-full antialiased')}
    >
      <body className={cn('h-full pt-[54px]', 'desktop:pt-[88px]')}>
        <NextIntlClientProvider>
          <Providers>
            <KakaoScript />
            <Header hasSessionCookie={hasSessionCookie} />
            <PageHeader />
            {children}
            <TopButton />
          </Providers>
        </NextIntlClientProvider>

        {/* Modal, Toast 렌더링 위치 */}
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}
