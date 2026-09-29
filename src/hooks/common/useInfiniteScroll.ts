import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /** sentinel이 뷰포트에 들어왔을 때 호출 (다음 페이지 로드 트리거) */
  onIntersect: () => void;
  /** false면 관찰을 멈춘다 (예: 더 불러올 페이지가 없을 때) */
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * IntersectionObserver 기반 무한 스크롤 공통 훅
 * 반환한 ref를 목록 하단 sentinel 엘리먼트에 연결하면, 해당 엘리먼트가
 * 뷰포트(rootMargin 포함)에 들어올 때마다 onIntersect를 호출한다.
 *
 * 데이터 소스와 무관하게 동작하므로 로컬 목업 페이지네이션과
 * TanStack Query의 useInfiniteQuery(fetchNextPage) 양쪽에 그대로 재사용할 수 있다.
 *
 * @example
 * const sentinelRef = useInfiniteScroll({ onIntersect: loadMore, enabled: hasMore });
 * <div ref={sentinelRef} />
 */
export default function useInfiniteScroll<T extends HTMLElement>({
  onIntersect,
  enabled = true,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const targetRef = useRef<T>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
}
