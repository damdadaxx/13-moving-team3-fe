'use client';

// root 레벨 공통 에러 UI
import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import EmptyState from '@/components/ui/EmptyState';

interface ErrorProps {
  // Next.js App Router는 서버 에러 추적용 digest를 Error에 주입
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      message={t('message')}
      buttonLabel={t('retry')}
      onClick={reset}
    />
  );
}
