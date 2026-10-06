// [메뉴] 내 견적 관리 메뉴
// [레이아웃] 대기중인 견적 / 받았던 견적 탭 공통 레이아웃
import { Suspense } from 'react';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import Tab from '@/components/ui/Tab';

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('EstimateTabs');
  const tabs = [
    {
      label: 'pending',
      value: t('customerPending'),
      href: ROUTES.customerEstimatesPending,
    },
    {
      label: 'received',
      value: t('customerReceived'),
      href: ROUTES.customerEstimates,
    },
  ];

  return (
    <div>
      {/* Tab이 useSearchParams를 쓰므로 프리렌더 bailout을 막는 경계가 필요하다 */}
      <Suspense>
        <Tab tabs={tabs} />
      </Suspense>
      {children}
    </div>
  );
}
