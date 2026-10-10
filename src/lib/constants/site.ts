import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { type Locale, type Messages, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  getOgImagePath,
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

/* 제목·설명·이미지는 언어별로 getOpenGraph에서 채운다 */
export const OPEN_GRAPH_DEFAULT = {
  type: 'website',
  siteName: SITE_NAME,
} satisfies Metadata['openGraph'];

/*
@ 로케일별 브랜드명
- 로고가 한글 벡터 아트워크라 한국어 외에는 그려줄 수 없어, 영문 "Moving"으로 대신 보여준다
- 인트로 애니메이션, 푸터 카피라이트 등 사용자에게 노출되는 브랜드명 표기에 쓴다
*/
export function getLocalizedSiteName(locale: string) {
  return locale === 'ko' ? SITE_NAME : 'Moving';
}

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
- og:title·og:description은 현재 locale 문구 (messages > Metadata)
- og:image는 public/og/{locale}.png
- 페이지의 openGraph는 레이아웃 openGraph를 통째로 덮어쓰므로, openGraph를 쓰는 곳은 모두 이 함수를 쓴다
*/
export async function getOpenGraph(
  locale: string,
  path: string,
): Promise<NonNullable<Metadata['openGraph']>> {
  const currentLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: currentLocale,
    namespace: 'Metadata',
  });

  return {
    ...OPEN_GRAPH_DEFAULT,
    images: [
      {
        url: getOgImagePath(currentLocale),
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        type: 'image/png',
      },
    ],
    title: t('ogTitle'),
    description: t('siteDescription'),
    locale: OG_LOCALE[currentLocale],
    alternateLocale: routing.locales
      .filter((otherLocale) => otherLocale !== currentLocale)
      .map((otherLocale) => OG_LOCALE[otherLocale]),
    url: getPathname({ locale: currentLocale, href: path }),
  };
}

/*
@ 페이지 공통 메타데이터 (제목 + locale별 OG + 트위터 카드)
*/
export async function createPageMetadata(
  locale: string,
  { title, path }: { title: string; path: string },
): Promise<Metadata> {
  return {
    title,
    openGraph: await getOpenGraph(locale, path),
    twitter: {
      card: 'summary_large_image',
    },
  };
}

type PageMetaKey = Exclude<
  keyof Messages['Metadata'],
  'siteTitle' | 'siteDescription' | 'ogTitle'
>;

/*
@ 페이지 generateMetadata
- 정적 경로: export const generateMetadata = pageMetadata('likedMovers', '/customer/liked-movers')
- id가 있는 경로: export const generateMetadata = pageMetadata('moverDetail', ({ id }) => `/mover/${id}`)
- 'use client' 페이지는 같은 폴더의 layout.tsx(서버)에서 내보낸다
*/
export function pageMetadata(
  titleKey: PageMetaKey,
  path: string | ((params: { id: string }) => string),
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string; id?: string }>;
  }): Promise<Metadata> {
    const { locale, id } = await params;
    const currentLocale = hasLocale(routing.locales, locale)
      ? locale
      : routing.defaultLocale;
    const t = await getTranslations({
      locale: currentLocale,
      namespace: 'Metadata',
    });

    return createPageMetadata(currentLocale, {
      title: t(titleKey),
      path: typeof path === 'string' ? path : path({ id: id ?? '' }),
    });
  };
}
