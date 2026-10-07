// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 찾기
import { Suspense } from 'react';

import MoverFindContent from '@/components/features/common/Mover/MoverFindContent';

export default function MoverPage() {
  // MoverFindContent가 useSearchParams로 필터를 읽으므로 프리렌더 bailout을 막는 경계가 필요하다
  return (
    <Suspense>
      <MoverFindContent />
    </Suspense>
  );
}
