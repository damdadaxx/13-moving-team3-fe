// 홈 모바일에서만 인트로가 끝나기 전까지 ScrollReveal이 재생되지 않도록 막는 컨텍스트
// 태블릿/PC, 이미 본 세션, 홈이 아닌 경로는 ready=true (인트로를 적용하지 않음)
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

import { routing } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

const INTRO_SEEN_KEY = 'moving-mobile-intro-seen';
/** tablet(744px) 미만만 모바일. 그 이상에서는 인트로를 렌더하지 않는다 */
const MOBILE_INTRO_QUERY = '(max-width: 743px)';

type IntroMode = 'play' | 'skip';

/*
@ 인트로 재생 여부
- 서버/hydration 스냅샷은 항상 skip이라 PC HTML에 주황 오버레이가 들어가지 않는다
- 매 조회마다 뷰포트를 다시 본다. PC에서 한 번 skip으로 고정하면
  같은 탭에서 모바일로 줄여도 인트로가 시작되지 않는다
- introRunning이 true인 동안은 sessionStorage를 이미 적어도 play를 유지한다
*/
const listeners = new Set<() => void>();
let introRunning = false;

function hasSeenLandingIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberLandingIntro() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
  } catch {
    // 사파리 프라이빗 모드 등 storage 접근이 막힌 경우엔 이번 페이지만 재생한다
  }
}

function computeIntroMode(): IntroMode {
  if (!window.matchMedia(MOBILE_INTRO_QUERY).matches) return 'skip';
  if (introRunning) return 'play';
  if (hasSeenLandingIntro()) return 'skip';
  return 'play';
}

function emitIntroMode() {
  listeners.forEach((listener) => listener());
}

function subscribeIntroMode(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(MOBILE_INTRO_QUERY);
  const onChange = () => {
    if (!media.matches) introRunning = false;
    listener();
  };
  media.addEventListener('change', onChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener('change', onChange);
  };
}

function getServerIntroMode(): IntroMode {
  return 'skip';
}

function getClientIntroMode(): IntroMode {
  return computeIntroMode();
}

/** 인트로가 화면에 올라온 뒤 호출한다. 재생 중에는 스냅샷을 play로 유지한다 */
export function beginLandingIntro() {
  introRunning = true;
  rememberLandingIntro();
}

/** 재생이 끝났거나 모바일 뷰포트를 벗어났을 때 같은 탭에서 다시 재생하지 않는다 */
export function dismissLandingIntro() {
  introRunning = false;
  rememberLandingIntro();
  emitIntroMode();
}

interface IntroGateContextValue {
  ready: boolean;
  /** 지금 경로가 홈인지 */
  isHome: boolean;
  /** 이번 방문에서 모바일 인트로를 재생 중인지 */
  isIntroActive: boolean;
  markReady: () => void;
}

const IntroGateContext = createContext<IntroGateContextValue>({
  ready: true,
  isHome: false,
  isIntroActive: false,
  markReady: () => {},
});

export function useIntroGate() {
  return useContext(IntroGateContext);
}

/*
@ 홈 경로 판별
- localePrefix: 'as-needed'라 기본 locale(ko)은 "/", 그 외는 "/en" 같은 locale 접두사만 붙는다
- 세그먼트가 1개여도 "/mover"처럼 locale이 아닌 일반 경로일 수 있어 locales 목록과 대조한다
*/
function isHomePath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return true;
  if (segments.length > 1) return false;
  return (routing.locales as readonly string[]).includes(segments[0]);
}

export default function IntroGateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = isHomePath(pathname);
  const mode = useSyncExternalStore(
    subscribeIntroMode,
    getClientIntroMode,
    getServerIntroMode,
  );
  const isIntroActive = isHome && mode === 'play';
  const [introFinished, setIntroFinished] = useState(false);
  const markReady = useCallback(() => {
    setIntroFinished(true);
  }, []);

  return (
    <IntroGateContext.Provider
      value={{
        ready: !isIntroActive || introFinished,
        isHome,
        isIntroActive,
        markReady,
      }}
    >
      {children}
    </IntroGateContext.Provider>
  );
}
