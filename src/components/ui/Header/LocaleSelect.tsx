'use client';

// 헤더 언어 선택. 트리거·목록은 기사님 찾기 정렬(Sort)과 같다.
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import Sort, { type SortOption } from '@/components/ui/Sort';

type AppLocale = (typeof routing.locales)[number];

const LOCALE_OPTIONS: SortOption<AppLocale>[] = routing.locales.map((code) => ({
  value: code,
  label: code.toUpperCase(),
}));

export default function LocaleSelect() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');

  function handleChange(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    const search = window.location.search;
    router.replace(search ? `${pathname}${search}` : pathname, {
      locale: nextLocale,
    });
  }

  return (
    <Sort
      options={LOCALE_OPTIONS}
      value={locale}
      onChange={handleChange}
      ariaLabel={t('language')}
      className={cn('shrink-0 mr-[-16px]', 'desktop:mr-[-22px]')}
    />
  );
}
