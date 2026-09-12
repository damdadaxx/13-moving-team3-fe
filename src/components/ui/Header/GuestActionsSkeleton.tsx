import { cn } from '@/utils/cn';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * 비로그인 상태 액션 스켈레톤
 * @returns 비로그인 상태 액션 스켈레톤 컴포넌트
 */
export default function GuestActionsSkeleton() {
  return (
    <Skeleton
      className={cn('hidden', 'desktop:block')}
      width={116}
      height={44}
      borderRadius={12}
    />
  );
}
