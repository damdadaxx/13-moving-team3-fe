'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { AuthVariant } from '@/types/role';

import {
  getHomePath,
  getSafeCallbackPath,
  getSigninPath,
} from '@/lib/constants/routes';
import { getLastPathname } from '@/lib/providers/PreviousPathRecorder';

import { useAccessDeniedModal } from '@/hooks/common/useAccessDeniedModal';
import { useLoginRequiredModal } from '@/hooks/common/useLoginRequiredModal';
import { useAuth } from '@/hooks/features/auth/useAuth';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

/*
@ 라우트 그룹 인증 가드
- guest: (auth) 비로그인 전용
- 이미 로그인된 채로 로그인·회원가입에 들어오면 안내 모달(확인)만 연다
- 이 페이지에서 방금 로그인·가입에 성공하면 모달 없이 역할 home(또는 callbackUrl)으로 보낸다
- customer / mover: 해당 역할 로그인 필요
- 비회원이 주소로 들어오면 페이지를 가리고 로그인 필요 모달을 연다
- 취소는 직전 페이지, 없으면 랜딩으로 보낸다. 로그인은 역할별 signin으로 보낸다
- 이 페이지에 들어온 뒤 로그아웃되면 모달 없이 역할별 signin으로 보낸다
- 다른 역할이 주소로 직접 들어오면 페이지·로딩을 가리고 권한 모달(확인)만 연다
- 확인을 누른 뒤에만 직전 페이지로 보낸다. 직전 페이지가 없으면 그 역할의 home으로 보낸다
- (public)은 가드하지 않는다
*/
interface AuthGuardProps {
  children: React.ReactNode;
  allow: AuthVariant;
}

export default function AuthGuard({ children, allow }: AuthGuardProps) {
  const { isLoading, isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const openAccessDeniedModal = useAccessDeniedModal();
  const openLoginRequiredModal = useLoginRequiredModal();
  const hasOpenedRef = useRef(false);
  /*
  @ 로그인·회원가입에 들어올 때 이미 로그인됐는지
  - null: 세션을 아직 모른다
  - true: 들어올 때부터 로그인. 안내 모달을 연다
  - false: 비로그인으로 들어옴. 이 화면에서 로그인에 성공하면 바로 보낸다
  */
  const [arrivedLoggedIn, setArrivedLoggedIn] = useState<boolean | null>(null);
  /*
  @ 보호 페이지에 들어올 때 비로그인인지
  - true: 들어올 때부터 비로그인. 로그인 필요 모달을 연다
  - false: 로그인된 채로 들어옴. 이후 로그아웃되면 signin으로 보낸다
  */
  const [arrivedLoggedOut, setArrivedLoggedOut] = useState<boolean | null>(
    null,
  );

  if (allow === 'guest' && !isLoading && arrivedLoggedIn === null) {
    setArrivedLoggedIn(isLoggedIn);
  }

  if (allow !== 'guest' && !isLoading && arrivedLoggedOut === null) {
    setArrivedLoggedOut(!isLoggedIn);
  }

  const isRoleMismatch =
    allow !== 'guest' &&
    !isLoading &&
    isLoggedIn &&
    role !== null &&
    role !== allow;

  const isArrivedWhileLoggedIn =
    allow === 'guest' &&
    !isLoading &&
    isLoggedIn &&
    role !== null &&
    arrivedLoggedIn === true;

  const needsLogin =
    allow !== 'guest' && !isLoading && !isLoggedIn && arrivedLoggedOut === true;

  const canRender =
    !isLoading &&
    (allow === 'guest' ? !isLoggedIn : isLoggedIn && role === allow);

  useEffect(() => {
    if (isLoading) return;

    if (allow === 'guest') {
      if (isLoggedIn && role && arrivedLoggedIn === false) {
        const callbackUrl = new URLSearchParams(window.location.search).get(
          'callbackUrl',
        );
        router.replace(getSafeCallbackPath(role, callbackUrl));
      }
      return;
    }

    if (!isLoggedIn && arrivedLoggedOut === false) {
      const signinPath = getSigninPath(allow);
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`${signinPath}?callbackUrl=${callbackUrl}`);
    }
  }, [
    allow,
    arrivedLoggedIn,
    arrivedLoggedOut,
    isLoading,
    isLoggedIn,
    pathname,
    role,
    router,
  ]);

  /*
  @ 들어가면 안 되는 페이지
  - 비회원: 로그인 필요 모달. 취소 전에는 다른 주소로 보내지 않는다
  - 다른 역할, 또는 이미 로그인된 사용자의 로그인·회원가입: 확인 모달
  - 페이지를 가리고, 버튼을 누르기 전에는 다른 주소로 보내지 않는다
  */
  useLayoutEffect(() => {
    if (hasOpenedRef.current) return;

    if (needsLogin) {
      hasOpenedRef.current = true;
      const previousPath = getLastPathname();
      const backPath =
        previousPath && previousPath !== pathname ? previousPath : '/';

      openLoginRequiredModal({
        callbackPath: pathname,
        signinPath: getSigninPath(allow),
        onCancel: () => {
          router.replace(backPath);
        },
      });
      return;
    }

    if ((!isRoleMismatch && !isArrivedWhileLoggedIn) || !role) return;

    hasOpenedRef.current = true;
    const previousPath = getLastPathname();
    const backPath =
      previousPath && previousPath !== pathname
        ? previousPath
        : getHomePath(role);

    openAccessDeniedModal({
      onConfirm: () => {
        router.replace(backPath);
      },
      reason: isArrivedWhileLoggedIn ? 'alreadyLoggedIn' : 'accessDenied',
    });
  }, [
    allow,
    isArrivedWhileLoggedIn,
    isRoleMismatch,
    needsLogin,
    openAccessDeniedModal,
    openLoginRequiredModal,
    pathname,
    role,
    router,
  ]);

  if (isRoleMismatch || isArrivedWhileLoggedIn || needsLogin) {
    return <div className="fixed inset-0 z-toast bg-gray-50" />;
  }

  if (!canRender) {
    return <LoadingDisplay />;
  }

  return children;
}
