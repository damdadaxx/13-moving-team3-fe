'use client';

import { useLayoutEffect } from 'react';

import { usePathname } from '@/i18n/navigation';
import type { Role } from '@/types/role';

import { isRoleAllowedPath } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/features/auth/useAuth';

/*
@ 마지막으로 머물렀던 앱 경로
- 클라이언트 이동만 기억한다
- 새로고침·주소 직접 입력은 기록이 비어서 직전 페이지가 없다
- 지금 역할이 볼 수 없는 경로는 기록하지 않는다. 막힌 페이지가 직전 경로를 덮지 않게 한다
- locale 접두사는 빼 둔다. 이동은 @/i18n/navigation 라우터가 다시 붙인다
- 서버 모듈 상태가 요청 간에 섞이지 않도록 브라우저에서만 갱신한다
*/
let lastPathname: string | null = null;

function rememberPathname(role: Role | null, pathname: string) {
  if (!isRoleAllowedPath(role, pathname)) return;
  if (pathname === lastPathname) return;

  lastPathname = pathname;
}

export function getLastPathname(): string | null {
  return lastPathname;
}

export default function PreviousPathRecorder() {
  const pathname = usePathname();
  const { role, isLoading } = useAuth();

  useLayoutEffect(() => {
    if (isLoading) return;

    rememberPathname(role, pathname);
  }, [isLoading, pathname, role]);

  return null;
}
