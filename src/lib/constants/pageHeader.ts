// PageHeader가 노출되는 페이지 경로와 제목

interface PageHeaderItem {
  path: string;
  title: string;
}

export const PAGE_HEADER_DATA: PageHeaderItem[] = [
  { path: '/customer/estimate-request', title: '견적요청' },
  { path: '/customer/estimates/received/:id', title: '견적 상세' },
  { path: '/customer/liked-movers', title: '찜한 기사님' },
  { path: '/mover/estimates/sent/:id', title: '견적 상세' },
  { path: '/mover/mypage', title: '마이페이지' },
];
