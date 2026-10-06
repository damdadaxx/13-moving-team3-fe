// PageHeader가 노출되는 페이지 경로와 제목
import type { Messages } from 'next-intl';

/*
@ 제목은 번역 키(messages > PageHeader)로 두고, PageHeader 컴포넌트에서 현재 언어로 바꾼다
- path는 locale 접두사가 없는 경로 (@/i18n/navigation 의 usePathname 기준)
*/
interface PageHeaderItem {
  path: string;
  titleKey: keyof Messages['PageHeader'];
}

export const PAGE_HEADER_DATA: PageHeaderItem[] = [
  { path: '/customer/estimate-request', titleKey: 'estimateRequest' },
  { path: '/customer/estimates/received/:id', titleKey: 'estimateDetail' },
  { path: '/customer/liked-movers', titleKey: 'likedMovers' },
  { path: '/mover/estimates/sent/:id', titleKey: 'estimateDetail' },
  { path: '/mover/mypage', titleKey: 'mypage' },
  { path: '/mover/requests', titleKey: 'receivedRequests' },
];
