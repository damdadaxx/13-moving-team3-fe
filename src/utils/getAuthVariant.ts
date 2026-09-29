import type { AuthVariant, Role } from '@/types/role';

/**
 * 세션 role을 guest | customer | mover 로 정규화한다
 * - 페이지·헤더 등 비회원 분기 공통
 */
export function getAuthVariant(role?: Role | null): AuthVariant {
  if (role === 'customer' || role === 'mover') {
    return role;
  }
  return 'guest';
}
