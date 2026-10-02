import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { type Locale, hasLocale } from 'next-intl';

import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
} from '@/lib/constants/kakao';

/*
@ 사이트 URL / OG 기본값
- 페이스북은 공유한 주소를 서버가 직접 방문해 og 태그를 읽는다
- NEXT_PUBLIC_SITE_URL 이 공개 https 주소여야 미리보기에 이미지가 붙는다
*/

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:5173'
).replace(/\/$/, '');

export const SITE_NAME = '무빙';

export const SITE_TITLE = '무빙 : 이사 소비자와 이사 전문가 매칭 서비스';
export const SITE_DESCRIPTION = '이사 소비자와 이사 전문가 매칭 서비스';
export const OG_TITLE = '무빙 : 복잡한 이사 준비, 무빙 하나면 끝!';

export const OPEN_GRAPH_DEFAULT = {
  title: OG_TITLE,
  description: SITE_DESCRIPTION,
  type: 'website',
  siteName: SITE_NAME,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      type: 'image/png',
    },
  ],
} satisfies Metadata['openGraph'];

/*
@ locale별 og:locale 값 (OG는 언어_지역 형식)
- Record<Locale, ...>로 지원하는 모든 locale을 강제한다
  → locale을 추가하면 여기를 채우기 전까지 타입 에러가 난다
*/
const OG_LOCALE: Record<Locale, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
};

/*
@ 페이지별 openGraph 생성
- og:locale은 현재 locale, og:locale:alternate는 나머지 지원 언어
- og:url은 현재 locale 주소 (ko는 접두사 없음, 그 외 /en 등)
- 페이지의 openGraph는 레이아웃 openGraph를 통째로 덮어쓰므로, openGraph를 쓰는 곳은 모두 이 함수를 쓴다
*/
export function getOpenGraph(
  locale: string,
  path: string,
): NonNullable<Metadata['openGraph']> {
  const currentLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return {
    ...OPEN_GRAPH_DEFAULT,
    locale: OG_LOCALE[currentLocale],
    alternateLocale: routing.locales
      .filter((otherLocale) => otherLocale !== currentLocale)
      .map((otherLocale) => OG_LOCALE[otherLocale]),
    url: getPathname({ locale: currentLocale, href: path }),
  };
}

/*
@ 페이지 공통 메타데이터 (제목 + locale별 OG + 트위터 카드)
- 페이지의 generateMetadata에서 locale과 경로만 넘긴다
  return createPageMetadata(locale, { title: '기사님 상세', path: `/mover/${id}` });
*/
export function createPageMetadata(
  locale: string,
  { title, path }: { title: string; path: string },
): Metadata {
  return {
    title,
    openGraph: getOpenGraph(locale, path),
    twitter: {
      card: 'summary_large_image',
    },
  };
}
