// 현재 경로에 해당하는 PageHeader 제목을 찾는 유틸
import { PAGE_HEADER_DATA } from '@/lib/constants/pageHeader';

/**
 * pathname이 PAGE_HEADER_DATA에 있으면 해당 제목을 반환한다.
 * `:id` 같은 동적 세그먼트는 한 칸만 매칭하고, 하위 경로는 제외한다.
 *
 * @param {string} pathname - 현재 경로
 * @returns {string | null} 매칭된 페이지 제목, 없으면 null
 */
export default function getPageHeaderTitle(pathname: string): string | null {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const matched = PAGE_HEADER_DATA.find((item) =>
    matchPath(item.path, normalizedPath),
  );

  return matched?.title ?? null;
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
