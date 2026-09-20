// 찜한 기사님 (기사님 찾기 데스크톱 오른쪽 영역)
'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLikedMoversQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import MoverCard from '@/components/public/MoverCard';

/** Figma에 보이는 개수 */
const LIKED_MOVER_COUNT = 3;

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
    size: LIKED_MOVER_COUNT,
    enabled: isCustomer,
  });

  if (!isCustomer || !data || data.list.length === 0) return null;

  return (
    <section
      aria-labelledby="liked-movers-title"
      className={cn('hidden flex-col gap-4 desktop:flex', className)}
    >
      <h2 id="liked-movers-title" className="text-xl-semibold text-black-400">
        찜한 기사님
      </h2>
      <ul className="flex flex-col gap-4">
        {data.list.map((mover) => (
          <li key={mover.id}>
            <MoverCard mover={mover} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}
