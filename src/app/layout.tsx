import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import Providers from '@/app/providers';

import { ACCESS_TOKEN_COOKIE } from '@/lib/constants/auth';
import { pretendard } from '@/lib/constants/fonts';

import { cn } from '@/utils/cn';

import Header from '@/components/ui/Header/Header';

import './globals.css';

// TODO: 최적화 작업 시 변경
export const metadata: Metadata = {
  title: '무빙 : 이사 소비자와 이사 전문가 매칭 서비스',
  description: ' 이사 소비자와 이사 전문가 매칭 서비스',
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
          <Header hasSessionCookie={hasSessionCookie} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
