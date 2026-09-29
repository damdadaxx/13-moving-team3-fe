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

function resolveBreakpointValues<T>(
  mobileOrValues: T | BreakpointValues<T>,
  tablet?: T,
  desktop?: T,
): BreakpointValues<T> {
  if (tablet !== undefined && desktop !== undefined) {
    return { mobile: mobileOrValues as T, tablet, desktop };
  }

  return mobileOrValues as BreakpointValues<T>;
}

/*
@ TODO:
- 객체 형태와 인자 3개 형태를 모두 받는다.
- 사용처 확인 후 나중에 객체 오버로드를 제거하고 인자 3개만 남기도록 리팩토링한다.
*/

/**
 * 현재 브레이크포인트(mobile/tablet/desktop)에 따라 값을 반환하는 훅
 *
 * SSR/hydration 중에는 항상 mobile 값을 반환하고, 마운트 후에만 실제 화면 크기를 반영한다.
 *
 * @example
 * useBreakpointValue({ mobile: 16, tablet: 24, desktop: 40 })
 * useBreakpointValue('sm', 'md', 'md')
 */
export function useBreakpointValue<T>(values: BreakpointValues<T>): T;
export function useBreakpointValue<T>(mobile: T, tablet: T, desktop: T): T;
export function useBreakpointValue<T>(
  mobileOrValues: T | BreakpointValues<T>,
  tablet?: T,
  desktop?: T,
): T {
  const values = resolveBreakpointValues(mobileOrValues, tablet, desktop);
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
