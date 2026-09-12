'use client';

import { useSyncExternalStore } from 'react';
import { useMediaQuery } from 'react-responsive';

interface BreakpointValues<T> {
  mobile: T;
  tablet: T;
  desktop: T;
}

const BREAKPOINTS = {
  tablet: 744,
  desktop: 1024,
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 현재 브레이크포인트(mobile/tablet/desktop)에 따라 values에서 해당 값을 반환하는 훅
 *
 * SSR/hydration 중에는 항상 mobile 값을 반환하고, 마운트 후에만 실제 화면 크기를 반영한다.
 *
 * @template T 반환 타입
 * @param {BreakpointValues<T>} values 각 브레이크포인트별 값
 * @returns {T} 현재 화면 크기에 맞는 값
 *
 * @example
 * const padding = useBreakpointValue({ mobile: 16, tablet: 24, desktop: 40 });
 */
export function useBreakpointValue<T>(values: BreakpointValues<T>): T {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS.desktop });
  const isTablet = useMediaQuery({ minWidth: BREAKPOINTS.tablet });

  if (!isClient) return values.mobile;
  if (isDesktop) return values.desktop;
  if (isTablet) return values.tablet;
  return values.mobile;
}
