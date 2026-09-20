// [메뉴] 내 견적 관리 메뉴
// [레이아웃] 대기중인 견적 / 받았던 견적 탭 공통 레이아웃
import { Suspense } from 'react';

import { ROUTES } from '@/lib/constants/routes';

import Tab from '@/components/ui/Tab';

const ESTIMATE_TABS = [
  {
    label: 'pending',
    value: '대기 중인 견적',
    href: `${ROUTES.customerEstimatesRoot}/pending`,
  },
  { label: 'received', value: '받았던 견적', href: ROUTES.customerEstimates },
];

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Tab이 useSearchParams를 쓰므로 프리렌더 bailout을 막는 경계가 필요하다 */}
      <Suspense>
        <Tab tabs={ESTIMATE_TABS} />
      </Suspense>
      {children}
    </div>
  );
}
