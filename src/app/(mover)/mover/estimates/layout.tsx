// [메뉴] 내 견적 관리 메뉴
// [레이아웃] 보낸 견적 조회 / 반려 요청 탭 공통 레이아웃
import Tab from '@/components/ui/Tab';

const TABS = [
  { label: 'sent', value: '보낸 견적 조회', href: '/mover/estimates/sent' },
  { label: 'rejected', value: '반려 요청', href: '/mover/estimates/rejected' },
];

export default function MoverEstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-gray-50">
      <Tab tabs={TABS} />
      {children}
    </div>
  );
}
