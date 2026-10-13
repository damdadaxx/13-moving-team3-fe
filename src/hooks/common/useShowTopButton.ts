'use client';

import { useSyncExternalStore } from 'react';

const SCROLL_SHOW_OFFSET = 200;

function subscribe(onStoreChange: () => void) {
  window.addEventListener('scroll', onStoreChange, { passive: true });
  return () => window.removeEventListener('scroll', onStoreChange);
}

function getScrollSnapshot() {
  return window.scrollY > SCROLL_SHOW_OFFSET;
}

function getServerScrollSnapshot() {
  return false;
}

/** 200px 이상 스크롤했을 때 맨 위로 버튼을 보여 준다. 채팅 버튼 위치와 같이 쓴다. */
export function useShowTopButton() {
  return useSyncExternalStore(
    subscribe,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );
}
