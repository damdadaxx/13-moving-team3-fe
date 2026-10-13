import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { MoverListData } from '@/types/mover';
import type { MetadataRoute } from 'next';
import type { Locale } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';
import { SITE_URL } from '@/lib/constants/site';
import serverFetchClient from '@/lib/services/serverFetchClient';

/*
@ 검색 노출 대상
- 비회원도 보는 공개 페이지만 넣는다. 로그인·마이페이지는 제외한다.
- ko는 접두사 없이, 그 외 locale은 /en 처럼 붙인다.
- 같은 페이지의 언어별 주소는 alternates로 묶고, x-default는 한국어 주소다.
- 기사님 상세는 공개 목록 API로 모은다. 조회가 실패하면 랜딩·기사님 찾기만 남긴다.
*/

const STATIC_PATHS = ['/', ROUTES.moverList] as const;
const MOVER_PAGE_SIZE = 50;
const MAX_MOVER_PAGES = 100;

type SitemapPath = (typeof STATIC_PATHS)[number] | `/mover/${string}`;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const moverPaths = (await getMoverIds()).map((id) => `/mover/${id}` as const);

  return [...STATIC_PATHS, ...moverPaths].flatMap((path) =>
    routing.locales.map((locale) => toEntry(path, locale)),
  );
}

function toEntry(
  path: SitemapPath,
  locale: Locale,
): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteUrl(path, locale),
    changeFrequency: path === '/' ? 'weekly' : 'daily',
    priority: path === '/' ? 1 : path === ROUTES.moverList ? 0.8 : 0.6,
    alternates: {
      languages: {
        ...Object.fromEntries(
          routing.locales.map((currentLocale) => [
            currentLocale,
            getAbsoluteUrl(path, currentLocale),
          ]),
        ),
        'x-default': getAbsoluteUrl(path, routing.defaultLocale),
      },
    },
  };
}

function getAbsoluteUrl(path: SitemapPath, locale: Locale) {
  return `${SITE_URL}${getPathname({ locale, href: path })}`;
}

async function getMoverIds(): Promise<string[]> {
  const apiBaseUrl = process.env.API_BASE_URL?.replace(/\/$/, '');
  if (!apiBaseUrl) return [];

  const ids: string[] = [];
  let cursor: string | undefined;
  const proxySecret = process.env.PROXY_SECRET;

  try {
    for (let page = 0; page < MAX_MOVER_PAGES; page += 1) {
      const url = new URL(`${apiBaseUrl}/mover`);
      url.searchParams.set('size', String(MOVER_PAGE_SIZE));
      if (cursor) url.searchParams.set('cursor', cursor);

      const data = await serverFetchClient<MoverListData>(url, {
        headers: proxySecret ? { 'X-Proxy-Secret': proxySecret } : undefined,
        signal: AbortSignal.timeout(8000),
      });

      for (const mover of data.list) {
        if (/^[A-Za-z0-9_-]+$/.test(mover.id)) ids.push(mover.id);
      }

      if (!data.nextCursor) break;
      cursor = data.nextCursor;
    }
  } catch {
    return ids;
  }

  return ids;
}
