import { cn } from '@/utils/cn';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * 로그인 상태 액션 스켈레톤
 * @returns 로그인 상태 액션 스켈레톤 컴포넌트
 */
export default function LoggedInActionsSkeleton() {
  return (
    <>
      <span
        className={cn(
          'inline-block h-[24px] w-[24px] shrink-0',
          'desktop:h-[36px] desktop:w-[36px]',
        )}
      >
        <Skeleton width="100%" height="100%" borderRadius="50%" />
      </span>
      <div className={cn('flex items-center gap-[16px]')}>
        <span
          className={cn(
            'inline-block h-[24px] w-[24px] shrink-0',
            'desktop:h-[36px] desktop:w-[36px]',
          )}
        >
          <Skeleton width="100%" height="100%" borderRadius="50%" />
        </span>
        <span
          className={cn('hidden h-[26px] w-[64px]', 'desktop:inline-block')}
        >
          <Skeleton width="100%" height="100%" />
        </span>
      </div>
    </>
  );
}
