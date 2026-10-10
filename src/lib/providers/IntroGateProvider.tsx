// 홈 경로의 인트로 애니메이션이 끝나기 전까지 ScrollReveal이 재생되지 않도록 막는 컨텍스트
// 홈이 아닌 경로는 처음부터 ready=true (인트로가 없으므로 바로 스크롤 리빌 동작)
'use client';

import { createContext, useContext, useState } from 'react';

import { routing } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

interface IntroGateContextValue {
  ready: boolean;
  /** 지금 경로에 인트로가 있는지 (홈 경로에서만 true) */
  isHome: boolean;
  markReady: () => void;
}

const IntroGateContext = createContext<IntroGateContextValue>({
  ready: true,
  isHome: false,
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
  const [ready, setReady] = useState(() => !isHomePath(pathname));
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setReady(!isHomePath(pathname));
  }

  return (
    <IntroGateContext.Provider
      value={{
        ready,
        isHome: isHomePath(pathname),
        markReady: () => setReady(true),
      }}
    >
      {children}
    </IntroGateContext.Provider>
  );
}
