import type { ReactNode } from 'react';

import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import Script from 'next/script';

import '@/app/globals.css';
import Providers from '@/app/providers';

import {
  ANALYTICS_CONSENT_COOKIE,
  parseAnalyticsConsent,
} from '@/lib/constants/analyticsConsent';
import { ACCESS_TOKEN_COOKIE } from '@/lib/constants/auth';
import { pretendard } from '@/lib/constants/fonts';
import { SITE_URL, getOpenGraph } from '@/lib/constants/site';

import { cn } from '@/utils/cn';

import ChatFloatingButton from '@/components/features/chat/ChatFloatingButton';
import AnalyticsConsentBanner from '@/components/features/common/AnalyticsConsentBanner';
import InstallPromptModal from '@/components/features/common/InstallPromptModal';
import Header from '@/components/ui/Header/Header';
import HeaderRevealWrapper from '@/components/ui/HeaderRevealWrapper';
import PageHeader from '@/components/ui/PageHeader';
import TopButton from '@/components/ui/TopButton';

/*
@ 브라우저 UI 색
- 탭·주소창 색은 흰색으로 둔다 (설치된 PWA의 상단 바 색은 manifest.ts의 theme_color)
*/
export const viewport: Viewport = {
  themeColor: '#ffffff',
};

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
    // iOS 홈 화면에 추가할 때의 아이콘과 앱 모드 (manifest는 app/manifest.ts가 자동 연결)
    icons: { apple: '/icons/apple-touch-icon.png' },
    appleWebApp: { capable: true, title: '무빙', statusBarStyle: 'default' },
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID;
  const hasGaMeasurementId =
    typeof gaMeasurementId === 'string' &&
    /^G-[A-Z0-9]+$/.test(gaMeasurementId);
  const analyticsConsent = parseAnalyticsConsent(
    cookieStore.get(ANALYTICS_CONSENT_COOKIE)?.value,
  );

  return (
    // 크롬 번역이 텍스트 노드를 <font>로 감싸면 React가 removeChild에서 깨진다
    // 다국어는 next-intl이 처리하므로 브라우저 자동 번역은 끈다
    <html
      lang={locale}
      translate="no"
      className={cn(pretendard.variable, 'notranslate h-full antialiased')}
    >
      <body className={cn('h-full pt-[54px]', 'desktop:pt-[88px]')}>
        {/*
        @ 앱 설치 이벤트를 먼저 받아 둔다
        - 새로고침하면 크롬이 beforeinstallprompt를 React가 뜨기 전에 보내서 놓치게 된다
        - 여기서 받아 window.__deferredInstallPrompt에 보관하면 InstallPromptModal이 뜬 뒤 꺼내 쓴다
        */}
        {/*
        @ 모바일 인트로를 이미 본 탭이면 덮개를 처음부터 숨긴다
        - sessionStorage 키는 IntroGateProvider의 INTRO_SEEN_KEY와 같다
        */}
        <Script id="intro-seen-flag" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem('moving-mobile-intro-seen')==='1')document.documentElement.setAttribute('data-intro-seen','');}catch(e){}`}
        </Script>
        <Script id="capture-install-prompt" strategy="beforeInteractive">
          {`window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__deferredInstallPrompt=e;});`}
        </Script>
        <NextIntlClientProvider>
          <Providers>
            <HeaderRevealWrapper>
              <Header hasSessionCookie={hasSessionCookie} />
            </HeaderRevealWrapper>
            <PageHeader />
            <main>{children}</main>
            {/* 채팅 버튼은 맨 위로 버튼 자리에 있다가, 맨 위로 버튼이 보이면 그 위로 올라간다 */}
            <ChatFloatingButton />
            <TopButton />
            <InstallPromptModal />
            {hasGaMeasurementId && (
              <AnalyticsConsentBanner
                gaMeasurementId={gaMeasurementId}
                initialConsent={analyticsConsent}
              />
            )}
          </Providers>
        </NextIntlClientProvider>

        {/* Modal, Toast 렌더링 위치 */}
        <div id="modal-root" />
        <div id="toast-root" />
        {hasGaMeasurementId && analyticsConsent === 'granted' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
