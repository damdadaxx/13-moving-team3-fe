'use client';

import { useSyncExternalStore } from 'react';

/*
@ usePortalRoot
- layout에 둔 #modal-root, #toast-root 같은 포탈 대상을 읽는다
- 서버 스냅샷은 null이라 하이드레이션이 어긋나지 않고, effect에서 setState하지 않는다
*/

const clientSnapshots = new Map<string, () => HTMLElement | null>();

/** @ 클라이언트 스냅샷
 * - 루트 DOM이 바뀌지 않아서 빈 함수로 대체한다
 * - 클라이언트 렌더링 시에는 실제 엘리먼트를 반환한다 */
function subscribe() {
  return () => {};
}

/** @ 서버 스냅샷
 * - 서버와 첫 하이드레이션에서 읽을 값
 * - 서버 렌더링 시에는 null을 반환한다 */
function getServerSnapshot(): HTMLElement | null {
  return null;
}

/** @ 클라이언트 스냅샷
 * - 클라이언트 렌더링 시에는 실제 엘리먼트를 반환한다 */
function getClientSnapshot(id: string) {
  const cached = clientSnapshots.get(id);
  if (cached) return cached;

  const snapshot = () => document.getElementById(id);
  clientSnapshots.set(id, snapshot);
  return snapshot;
}

/** @ 포탈 루트 엘리먼트 읽기 */
export function usePortalRoot(id: string): HTMLElement | null {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot(id),
    getServerSnapshot,
  );
}
