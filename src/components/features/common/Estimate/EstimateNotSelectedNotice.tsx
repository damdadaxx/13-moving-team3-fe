import { useTranslations } from 'next-intl';

import IcInfo from '@/assets/icons/ic_info.svg';

import { cn } from '@/utils/cn';

/**
 * @ 확정하지 않은 견적 안내 배너
 * - 받았던 견적 상세에서 상태가 NOT_SELECTED(다른 견적이 확정돼 미선택)일 때만 보여준다
 */
export default function EstimateNotSelectedNotice({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations('Estimate');

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-[12px] bg-background-200 rounded-[12px] px-[16px] py-[16px] text-lg-semibold text-black-100',
        'tablet:justify-start tablet:px-[28px] tablet:py-[20px]',
        className,
      )}
    >
      <IcInfo aria-hidden className="h-[24px] w-[24px] shrink-0" />
      <p>{t('notSelected')}</p>
    </div>
  );
}
