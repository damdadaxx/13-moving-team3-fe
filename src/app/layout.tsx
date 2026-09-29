import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import Providers from '@/app/providers';

import { ACCESS_TOKEN_COOKIE } from '@/lib/constants/auth';
import { pretendard } from '@/lib/constants/fonts';
import {
  OPEN_GRAPH_DEFAULT,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/constants/site';
import KakaoScript from '@/lib/providers/KakaoScript';

import { cn } from '@/utils/cn';

import Header from '@/components/ui/Header/Header';
import PageHeader from '@/components/ui/PageHeader/PageHeader';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    ...OPEN_GRAPH_DEFAULT,
    url: '/',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSessionCookie = cookieStore.has(ACCESS_TOKEN_COOKIE);

  return (
    <html lang="ko" className={cn(pretendard.variable, 'h-full antialiased')}>
      <body className={cn('h-full pt-[54px]', 'desktop:pt-[88px]')}>
        <Providers>
          <KakaoScript />
          <Header hasSessionCookie={hasSessionCookie} />
          <PageHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
