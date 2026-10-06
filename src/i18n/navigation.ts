/*
@ locale을 유지하는 네비게이션 래퍼
- next/link, next/navigation 대신 여기서 가져와야 locale 접두사가 유지된다
- 실제 교체는 라우팅 교체 PR에서 한 번에 진행한다
*/
import { routing } from '@/i18n/routing';
import { createNavigation } from 'next-intl/navigation';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
