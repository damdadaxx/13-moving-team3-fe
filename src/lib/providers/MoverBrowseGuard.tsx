'use client';

import { useLayoutEffect, useRef } from 'react';

import { useRouter } from '@/i18n/navigation';

import { ROUTES } from '@/lib/constants/routes';
import { getLastPathname } from '@/lib/providers/PreviousPathRecorder';

import { useAccessDeniedModal } from '@/hooks/common/useAccessDeniedModal';
import { useAuth } from '@/hooks/features/auth/useAuth';

/*
@ 기사님 찾기·상세 접근 제한
- 비회원·고객만 본다
- 기사님이 주소로 들어오면 페이지를 가리고 접근 권한 안내 모달을 띄운다
- 메인으로 이동은 받은 요청으로 간다
- 이전 페이지로·닫기·바깥 클릭·ESC는 찾기·상세에 들어오기 직전 페이지로 간다
- 직전 페이지가 없으면 받은 요청으로 간다
- 확인 전에는 다른 주소로 보내지 않는다
*/
export default function MoverBrowseGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const openAccessDeniedModal = useAccessDeniedModal();
  const { isLoading, role } = useAuth();
  const isMover = role === 'mover';
  const hasOpenedRef = useRef(false);

  useLayoutEffect(() => {
    if (isLoading || !isMover || hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    const homePath = ROUTES.moverHome;
    const previousPath = getLastPathname() ?? homePath;

    openAccessDeniedModal({
      onGoMain: () => {
        router.replace(homePath);
      },
      onGoPrevious: () => {
        router.replace(previousPath);
      },
    });
  }, [isLoading, isMover, openAccessDeniedModal, router]);

  if (isMover) {
    return <div className="fixed inset-0 z-modal bg-gray-50" />;
  }

  return children;
}
