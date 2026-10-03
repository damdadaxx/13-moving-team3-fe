import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';

import formatDate from '@/utils/formatDate';

type FormatDateType = NonNullable<Parameters<typeof formatDate>[1]>;

/** 한국어가 아닐 때 쓰는 Intl 형식 (formatDate 의 type 별 의미를 따른다) */
const INTL_OPTIONS: Record<
  Exclude<FormatDateType, 'review' | 'relative'>,
  Intl.DateTimeFormatOptions
> = {
  usage: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  },
  korean: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' },
  requested: { year: 'numeric', month: 'short', day: 'numeric' },
  short: { year: '2-digit', month: '2-digit', day: '2-digit' },
};

/*
@ 날짜 표시 (현재 언어)
- 한국어(기본 locale)는 기존 formatDate 결과를 그대로 쓴다 → 한국어 화면은 이전과 똑같다
  예) 2024년 07월 01일 (월), 2024. 08. 26(월) 오전 10:00
- 그 외 언어는 Intl 표준 형식으로 바꾼다
  예) en: Mon, Jul 1, 2024 / ja: 2024年7月1日(月)
- 'review'(2024-07-01)는 언어와 무관해 그대로, 'relative'(N분 전)는 Intl.RelativeTimeFormat
@ 사용 예시
const formatDateLocale = useFormatDate();
formatDateLocale(moveDate, 'korean');
*/
export function useFormatDate() {
  const locale = useLocale();

  return (date: Date | string | number, type: FormatDateType = 'usage') => {
    if (locale === routing.defaultLocale || type === 'review') {
      return formatDate(date, type);
    }

    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    if (type === 'relative') {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      const diffMin = Math.floor((Date.now() - d.getTime()) / (60 * 1000));
      if (diffMin < 1) return rtf.format(0, 'minute');
      if (diffMin < 60) return rtf.format(-diffMin, 'minute');
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return rtf.format(-diffHour, 'hour');
      return rtf.format(-Math.floor(diffHour / 24), 'day');
    }

    return new Intl.DateTimeFormat(locale, INTL_OPTIONS[type]).format(d);
  };
}
