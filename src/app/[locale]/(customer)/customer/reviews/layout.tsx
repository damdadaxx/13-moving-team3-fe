import { useTranslations } from 'next-intl';

import { ROUTES } from '@/lib/constants/routes';

import Tab from '@/components/ui/Tab';

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('CustomerReviews');
  const tabs = [
    {
      label: 'pending',
      value: t('tabPending'),
      href: ROUTES.customerReviewsPending,
    },
    {
      label: 'completed',
      value: t('tabCompleted'),
      href: ROUTES.customerReviewsCompleted,
    },
  ];

  return (
    <div className="min-h-full bg-background-100">
      <Tab tabs={tabs} />
      {children}
    </div>
  );
}
