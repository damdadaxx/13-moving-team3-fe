// 현재 경로에 해당하는 PageHeader 제목(번역 키)을 찾는 유틸
import type { Messages } from 'next-intl';

import { PAGE_HEADER_DATA } from '@/lib/constants/pageHeader';

/**
 * pathname이 PAGE_HEADER_DATA에 있으면 해당 제목의 번역 키를 반환한다.
 * 실제 문구는 호출하는 쪽에서 useTranslations('PageHeader')로 바꾼다.
 * `:id` 같은 동적 세그먼트는 한 칸만 매칭하고, 하위 경로는 제외한다.
 *
 * @param {string} pathname - 현재 경로 (locale 접두사 없음)
 * @returns 매칭된 제목 번역 키, 없으면 null
 */
export default function getPageHeaderTitleKey(
  pathname: string,
): keyof Messages['PageHeader'] | null {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const matched = PAGE_HEADER_DATA.find((item) =>
    matchPath(item.path, normalizedPath),
  );

  return matched?.titleKey ?? null;
}

function matchPath(pattern: string, pathname: string): boolean {
  const patternSegments = pattern.split('/');
  const pathSegments = pathname.split('/');

  if (patternSegments.length !== pathSegments.length) return false;

  return patternSegments.every(
    (segment, index) =>
      segment.startsWith(':') || segment === pathSegments[index],
  );
}
