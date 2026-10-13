'use client';

import { useLayoutEffect, useRef } from 'react';

import { useRouter } from '@/i18n/navigation';

import { ROUTES } from '@/lib/constants/routes';
import { getLastPathname } from '@/lib/providers/PreviousPathRecorder';

import { useAccessDeniedModal } from '@/hooks/common/useAccessDeniedModal';
import { useAuth } from '@/hooks/features/auth/useAuth';

import CustomerProfileGuard from '@/components/features/customer/CustomerProfileGuard';

/*
@ 기사님 찾기·상세 접근 제한
- 비회원·고객만 본다
- 로그인한 고객은 프로필 등록 여부도 확인하고, 미등록이면 고객 등록 페이지로 보낸다.
- 비회원은 기존처럼 이용할 수 있고 고객 프로필 API를 요청하지 않는다.
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

  /* 세션 확인 전에는 목록을 그리지 않아 기사님 계정에 찾기 화면이 잠깐 보이지 않게 한다 */
  if (isLoading || isMover) {
    return <div className="fixed inset-0 z-modal bg-gray-50" />;
  }

  /*
  @ 로그인 고객의 프로필 검사
  - 고객일 때만 가드를 마운트해 비회원·기사님에게 고객 프로필 조회를 요청하지 않는다.
  - 기존 고객 메뉴와 같은 미등록/인증 만료/조회 실패 처리를 재사용한다.
  - pendingFallback=null은 프로필 확인 전 목록이 잠깐 보이는 현상을 막는다.
  - 이 가드는 공용 레이아웃에 있으므로 메뉴 클릭뿐 아니라 직접 접속·새로고침에도 적용된다.
  */
  if (role === 'customer') {
    return (
      <CustomerProfileGuard pendingFallback={null}>
        {children}
      </CustomerProfileGuard>
    );
  }

  return children;
}
