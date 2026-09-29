'use client';

import { useEffect } from 'react';

// root layout 에러 최후 보루
// app/layout.tsx 자체가 에러났을 때만 동작

import { pretendard } from '@/lib/constants/fonts';

import { cn } from '@/utils/cn';

import EmptyState from '@/components/ui/EmptyState';

import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko" className={cn(pretendard.variable, 'h-full antialiased')}>
      <body className="h-full">
        <EmptyState
          message="앱에 오류가 발생했어요!"
          buttonLabel="새로고침"
          onClick={reset}
          isFullViewport
        />
      </body>
    </html>
  );
}
