// root 레벨 로딩 UI (페이지 이동 시 표시)
'use client';

import { usePathname } from '@/i18n/navigation';

import { isLoginRequiredPath, isRoleBlockedPath } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/features/auth/useAuth';

import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function Loading() {
  const pathname = usePathname();
  const { role, isLoading, isLoggedIn } = useAuth();

  /*
  @ 보면 안 되는 페이지로 넘어가는 중
  - 대상 화면 제목과 로딩 스피너가 모달보다 먼저 보이지 않게 비운다
  */
  const isBlocked =
    !isLoading &&
    (isLoggedIn && role
      ? isRoleBlockedPath(role, pathname)
      : isLoginRequiredPath(pathname));

  if (isBlocked) return null;

  return <LoadingDisplay />;
}
