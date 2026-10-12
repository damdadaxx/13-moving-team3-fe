'use client';

import { useEffect } from 'react';

import { useRouter } from '@/i18n/navigation';

import {
  ROUTES,
  isGuestOnlyPath,
  isLoginRequiredPath,
  isMoverBrowsePath,
  isOtherRoleProtectedPath,
  splitLocalePrefix,
} from '@/lib/constants/routes';

import { useAccessDeniedModal } from '@/hooks/common/useAccessDeniedModal';
import { useLoginRequiredModal } from '@/hooks/common/useLoginRequiredModal';
import { useAuth } from '@/hooks/features/auth/useAuth';

/*
@ 들어가면 안 되는 페이지로 가는 링크를 누르기 전에 막는다
- 이동이 시작되면 대상 화면이 모달보다 먼저 그려지므로, 클릭 시점에 막는다
- 비회원: 로그인 필요 안내. 취소는 지금 페이지에 남기고, 로그인은 그 페이지로 돌아온다
- 다른 역할 페이지: 권한 안내. 확인은 모달만 닫는다
- 로그인·회원가입: 이미 로그인된 안내. 확인은 모달만 닫는다
- 기사님이 기사님 찾기·상세: 메인으로 이동 / 이전 페이지로. 이전은 지금 페이지에 남긴다
*/
function pathnameFromHref(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;

    return splitLocalePrefix(url.pathname).path;
  } catch {
    return null;
  }
}

export default function CrossRoleAccessGuard() {
  const { role, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  const openAccessDeniedModal = useAccessDeniedModal();
  const openLoginRequiredModal = useLoginRequiredModal();

  useEffect(() => {
    if (isLoading) return;

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (!href) return;

      const pathname = pathnameFromHref(href);
      if (!pathname) return;

      if (!isLoggedIn) {
        if (!isLoginRequiredPath(pathname)) return;

        event.preventDefault();
        openLoginRequiredModal({
          callbackPath: pathname,
          signinPath: pathname.startsWith('/mover')
            ? ROUTES.moverSignin
            : ROUTES.customerSignin,
        });
        return;
      }

      if (!role) return;

      if (isGuestOnlyPath(pathname)) {
        event.preventDefault();
        openAccessDeniedModal({
          onConfirm: () => {},
          reason: 'alreadyLoggedIn',
        });
        return;
      }

      if (role === 'mover' && isMoverBrowsePath(pathname)) {
        event.preventDefault();
        openAccessDeniedModal({
          onGoMain: () => {
            router.replace(ROUTES.moverHome);
          },
          onGoPrevious: () => {},
        });
        return;
      }

      if (!isOtherRoleProtectedPath(role, pathname)) return;

      event.preventDefault();
      openAccessDeniedModal({ onConfirm: () => {} });
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [
    isLoading,
    isLoggedIn,
    openAccessDeniedModal,
    openLoginRequiredModal,
    role,
    router,
  ]);

  return null;
}
