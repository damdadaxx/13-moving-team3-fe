import { useTranslations } from 'next-intl';

import { useFormatPrice } from '@/hooks/common/useFormatPrice';

import { cn } from '@/utils/cn';

/**
 * @ 견적가 표시
 * - 본문 인라인(inline)과 데스크탑 사이드바(sidebar)에서 스타일만 다르다
 * - hidden이면 렌더 트리에서 완전히 빠진다(display:none)
 */
export default function EstimatePriceSection({
  price,
  layout,
  hidden,
  className,
}: {
  price: number | null;
  layout: 'inline' | 'sidebar';
  hidden?: boolean;
  className?: string;
}) {
  const t = useTranslations('Estimate');
  const formatPrice = useFormatPrice();
  const priceText = price === null ? t('pricePending') : formatPrice(price);

  if (layout === 'sidebar') {
    return (
      <div
        className={cn(
          'flex flex-col mt-[132px]',
          hidden && 'hidden',
          className,
        )}
      >
        <p className="text-2lg-semibold text-gray-300">{t('price')}</p>
        <p className={cn('text-xl-bold', 'tablet:text-2xl-bold')}>
          {priceText}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-[20px] border-b border-line-100 text-black-400',
        'tablet:py-[32px] tablet:justify-start tablet:gap-[61px]',
        'desktop:py-[26px_36px]',
        hidden && 'hidden',
        className,
      )}
    >
      <p className={cn('text-lg-semibold', 'tablet:text-xl-semibold')}>
        {t('price')}
      </p>
      <p className={cn('text-xl-bold', 'tablet:text-2xl-bold')}>{priceText}</p>
    </div>
  );
}
