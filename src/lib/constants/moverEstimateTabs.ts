// 기사님 내 견적 관리 메뉴 탭 (보낸 견적 조회 / 반려 요청)
// 탭 이름은 번역 키(messages > EstimateTabs), 레이아웃에서 현재 언어로 바꾼다
import type { Messages } from 'next-intl';

export const MOVER_ESTIMATE_TABS: {
  label: string;
  valueKey: keyof Messages['EstimateTabs'];
  href: string;
}[] = [
  { label: 'sent', valueKey: 'moverSent', href: '/mover/estimates/sent' },
  {
    label: 'rejected',
    valueKey: 'moverRejected',
    href: '/mover/estimates/rejected',
  },
];
