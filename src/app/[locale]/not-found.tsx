'use client';

// 404 페이지
import { useTranslations } from 'next-intl';

import EmptyState from '@/components/ui/EmptyState';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <EmptyState message={t('message')} buttonLabel={t('goHome')} href="/" />
  );
}
