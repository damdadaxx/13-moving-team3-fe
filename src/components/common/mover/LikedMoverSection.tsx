// 찜한 기사님 (기사님 찾기 데스크톱 오른쪽 영역)
'use client';

import { LIKED_MOVER_ID_PAGE_SIZE } from '@/lib/constants/mover';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLikedMoversQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import MoverCard from '@/components/common/mover/MoverCard';

/*
@ 노출 조건
- 찜은 고객만 할 수 있어서(GET /likes/me 고객 전용) 고객 로그인일 때만 그린다
- Figma는 데스크톱에만 있다. 모바일·태블릿은 숨긴다
- 찜한 기사님이 없으면 영역 자체를 그리지 않는다
*/
export default function LikedMoverSection({
  className,
}: {
  className?: string;
}) {
  const { role } = useAuth();
  const isCustomer = role === 'customer';
  const { data } = useLikedMoversQuery({
    size: LIKED_MOVER_ID_PAGE_SIZE,
    enabled: isCustomer,
  });
  const likedMovers = data?.list ?? [];

  if (!isCustomer || likedMovers.length === 0) return null;

  return (
    <section
      aria-labelledby="liked-movers-title"
      className={cn('hidden flex-col gap-4 desktop:flex', className)}
    >
      <h2
        id="liked-movers-title"
        className="shrink-0 text-xl-semibold text-black-400"
      >
        찜한 기사님
      </h2>
      {/* 제목은 고정하고 카드만 스크롤. 영역이 뷰포트보다 길어도 sticky가 풀리지 않게 */}
      <ul className="flex min-h-0 flex-col gap-4 overflow-y-auto scrollbar-gray-300">
        {likedMovers.map((mover) => (
          <li key={mover.id} className="shrink-0">
            <MoverCard mover={mover} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}
