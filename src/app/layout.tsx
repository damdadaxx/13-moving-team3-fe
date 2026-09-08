import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import Providers from '@/app/providers';

import { pretendard } from '@/lib/constants/fonts';

import { cn } from '@/utils/cn';

import './globals.css';

// TODO: 최적화 작업 시 변경
export const metadata: Metadata = {
  title: '무빙 : 이사 소비자와 이사 전문가 매칭 서비스',
  description: ' 이사 소비자와 이사 전문가 매칭 서비스',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={cn(pretendard.variable, 'h-full antialiased')}>
      <body>
        {/* TODO: Container 컴포넌트 추가 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
