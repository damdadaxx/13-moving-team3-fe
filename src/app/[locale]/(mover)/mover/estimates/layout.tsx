// [메뉴] 내 견적 관리 메뉴
// [레이아웃] 보낸 견적 조회 / 반려 요청 탭 공통 레이아웃
//
// 탭은 목록 페이지(/mover/estimates/sent, /mover/estimates/rejected)에서만 보여야 한다.
// useSelectedLayoutSegments로 열린 경로 조각을 배열로 받아, 조각이 1개(목록)일 때만 그린다
// (예: sent/[id] 상세는 조각이 2개라 탭이 사라진다)
'use client';

import { useTranslations } from 'next-intl';
import { useSelectedLayoutSegments } from 'next/navigation';

import { MOVER_ESTIMATE_TABS } from '@/lib/constants/moverEstimateTabs';

import Tab from '@/components/ui/Tab';

export default function MoverEstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('EstimateTabs');
  const segments = useSelectedLayoutSegments();
  const tabs = MOVER_ESTIMATE_TABS.map(({ valueKey, ...tab }) => ({
    ...tab,
    value: t(valueKey),
  }));
  const isListPage = segments.length === 1;

  return (
    <div className="flex flex-col bg-gray-50">
      {isListPage && <Tab tabs={tabs} />}
      {children}
    </div>
  );
}
