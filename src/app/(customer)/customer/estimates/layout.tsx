// [메뉴] 내 견적 관리 메뉴
// [레이아웃] 대기중인 견적 / 받았던 견적 탭 공통 레이아웃
import Tab from '@/components/ui/Tab';

interface TabItem {
  label: string;
  value: string;
  href: string;
}

const CUSTOMER_ESTIMATE_TABS: TabItem[] = [
  {
    label: 'pending',
    value: '대기 중인 견적',
    href: '/customer/estimates/pending',
  },
  {
    label: 'received',
    value: '받았던 견적',
    href: '/customer/estimates/received',
  },
];
export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Tab tabs={CUSTOMER_ESTIMATE_TABS}></Tab>
      {children}
    </div>
  );
}
