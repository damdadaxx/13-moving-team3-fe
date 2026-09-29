'use client';

// root 레벨 공통 에러 UI
import { useEffect } from 'react';

import EmptyState from '@/components/ui/EmptyState';

interface ErrorProps {
  // Next.js App Router는 서버 에러 추적용 digest를 Error에 주입
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      message="오류가 발생했어요!"
      buttonLabel="다시 시도"
      onClick={reset}
    />
  );
}
