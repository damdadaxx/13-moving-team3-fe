import { ROUTES } from '@/lib/constants/routes';

import Tab from '@/components/ui/Tab';

const REVIEW_TABS = [
  {
    label: 'pending',
    value: '작성 가능한 리뷰',
    href: ROUTES.customerReviewsPending,
  },
  {
    label: 'completed',
    value: '내가 작성한 리뷰',
    href: ROUTES.customerReviewsCompleted,
  },
];

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-background-100">
      <Tab tabs={REVIEW_TABS} />
      {children}
    </div>
  );
}
