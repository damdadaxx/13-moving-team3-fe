// [공용] 견적 상세 스켈레톤
'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import type { EstimateDetailVariant } from '@/components/features/common/Estimate/EstimateDetailContent';
import PageBanner from '@/components/ui/PageBanner';
import { Skeleton } from '@/components/ui/Skeleton';

const ESTIMATE_INFO_VALUE_WIDTHS = [96, 72, 120, '58%', '62%', '70%'] as const;

/** @ 배너와 프로필 이미지 자리표시 */
function TopSectionSkeleton({ hasProfileImage }: { hasProfileImage: boolean }) {
  return (
    <section
      className={cn(
        'relative pb-[22px]',
        'tablet:pb-[23px]',
        'desktop:pb-[51px]',
        !hasProfileImage && 'pb-0!',
      )}
    >
      <PageBanner />
      {hasProfileImage && (
        <div
          className={cn('absolute inset-0 z-10 px-[20px]', 'tablet:px-[72px]')}
        >
          <div className="relative mx-auto h-full w-full max-w-[1200px]">
            <Skeleton
              width={64}
              height={64}
              borderRadius={12}
              className={cn(
                'absolute bottom-0 left-0',
                'tablet:size-[100px]!',
                'desktop:size-[134px]!',
              )}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/** @ 서비스 태그 자리표시 */
function ServiceTagSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('mb-[12px] flex items-center justify-between', className)}
    >
      <div className="flex gap-[8px]">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton
            key={index}
            width={72}
            height={26}
            borderRadius={4}
            className="tablet:h-[32px]! tablet:rounded-[6px]!"
          />
        ))}
      </div>
      <Skeleton width={56} height={26} className="tablet:hidden" />
    </div>
  );
}

/** @ 제목과 상태 뱃지 자리표시 */
function IntroSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mb-[16px] flex items-center justify-between border-b border-line-100 pb-[12px]',
        'tablet:mb-[20px] tablet:pb-[20px]',
        className,
      )}
    >
      <Skeleton width="62%" height={26} className="tablet:h-[32px]!" />
      <Skeleton width={64} height={26} className="hidden tablet:block" />
    </div>
  );
}

/** @ 기사님 닉네임·통계 자리표시 */
function MoverProfileSkeleton() {
  return (
    <div
      className={cn('border-b border-line-100 pb-[12px]', 'tablet:pb-[20px]')}
    >
      <div className="mb-[8px] flex items-center justify-between">
        <Skeleton width={140} height={26} className="tablet:mb-[12px]!" />
        <Skeleton width={36} height={24} />
      </div>
      <Skeleton width="72%" height={20} />
    </div>
  );
}

/** @ 견적가 자리표시 */
function PriceSkeleton({ layout }: { layout: 'inline' | 'sidebar' }) {
  if (layout === 'sidebar') {
    return (
      <div className="mt-[132px] flex flex-col gap-[8px]">
        <Skeleton width={48} height={26} />
        <Skeleton width={160} height={32} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-line-100 py-[20px]',
        'tablet:justify-start tablet:gap-[61px] tablet:py-[32px]',
        'desktop:py-[26px_36px]',
      )}
    >
      <Skeleton width={48} height={26} className="tablet:h-[32px]!" />
      <Skeleton width={140} height={32} />
    </div>
  );
}

/** @ 견적 정보 자리표시 */
function EstimateInfoSkeleton() {
  return (
    <div
      className={cn(
        'border-b border-line-100 py-[20px]',
        'tablet:py-[32px]',
        'desktop:border-b-0 desktop:py-[30px]',
      )}
    >
      <Skeleton
        width={64}
        height={26}
        className={cn(
          'mb-[20px]!',
          'tablet:mb-[32px]! tablet:h-[32px]!',
          'desktop:mb-[28px]!',
        )}
      />
      <div className={cn('flex flex-col gap-[12px]', 'tablet:gap-[16px]')}>
        {ESTIMATE_INFO_VALUE_WIDTHS.map((width, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between',
              'tablet:justify-start tablet:gap-[23px]',
            )}
          >
            <Skeleton width={72} height={26} />
            <Skeleton width={width} height={26} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** @ 공유 버튼 자리표시 */
function ShareSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn('desktop:mt-[40px]', className)}>
      <Skeleton
        width={140}
        height={26}
        className="mb-[12px]! tablet:h-[32px]! desktop:mb-[22px]!"
      />
      <div className={cn('flex gap-[12px]', 'tablet:gap-[16px]')}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            key={index}
            width={40}
            height={40}
            borderRadius={8}
            className="desktop:size-[64px]! desktop:rounded-[16px]!"
          />
        ))}
      </div>
    </section>
  );
}

/** @ 모바일·태블릿 하단 확정 버튼 자리표시 */
function StickyBarSkeleton() {
  return (
    <section
      className={cn(
        'fixed right-0 bottom-0 left-0 border-t border-line-200 bg-gray-50 px-[20px] py-[28px]',
        'tablet:px-[72px]',
        'desktop:hidden',
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-[8px]">
        <Skeleton width={54} height={54} borderRadius={16} />
        <div className="min-w-0 flex-1">
          <Skeleton height={54} borderRadius={12} />
        </div>
      </div>
    </section>
  );
}

/**
 * @ 견적 상세 스켈레톤
 * - 대기중인 견적/받았던 견적/기사님 확정견적 3곳에서 variant로 구분해 쓴다
 * - 화면 구조는 그대로 두고 variant에 안 맞는 섹션만 뺀다
 */
export default function EstimateDetailSkeleton({
  variant,
}: {
  variant: EstimateDetailVariant;
}) {
  const t = useTranslations('Common');
  const isMoverConfirmed = variant === 'moverConfirmed';
  const isCtaHidden = variant !== 'customerPending';

  return (
    <main className="bg-gray-50" aria-busy="true" aria-label={t('loading')}>
      <TopSectionSkeleton hasProfileImage={!isMoverConfirmed} />

      <section
        className={cn(
          'px-[20px] pb-[134px]',
          'tablet:px-[72px] tablet:pb-[126px]',
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-[1200px]',
            'desktop:flex desktop:gap-[140px]',
          )}
        >
          <div className="min-w-0 desktop:flex-1">
            <div
              className={cn(
                'mt-[13px]',
                'tablet:mt-[23px]',
                'desktop:mt-[31px]',
              )}
            >
              <ServiceTagSkeleton
                className={cn(
                  isMoverConfirmed &&
                    'mt-[36px] tablet:mt-[46px] desktop:mt-[40px]',
                )}
              />

              {!isMoverConfirmed && <IntroSkeleton />}
              {!isMoverConfirmed && <MoverProfileSkeleton />}
              {isMoverConfirmed && (
                <IntroSkeleton
                  className={cn(
                    'mb-0 pt-[8px] pb-[20px]',
                    'tablet:mb-0 tablet:pb-[30px]',
                  )}
                />
              )}

              <PriceSkeleton layout="inline" />
              <EstimateInfoSkeleton />
            </div>

            <ShareSkeleton className={cn('pt-[32px]', 'desktop:hidden')} />
          </div>

          <section
            className={cn(
              'hidden',
              'desktop:block desktop:w-[calc(320/1200*100%)] desktop:max-w-[320px] desktop:px-0',
            )}
          >
            <div
              className={cn(
                !isCtaHidden && 'border-b border-line-100 pb-[40px]',
              )}
            >
              {!isCtaHidden && (
                <>
                  <PriceSkeleton layout="sidebar" />
                  <Skeleton
                    height={64}
                    borderRadius={16}
                    className="mt-[29px]"
                  />
                </>
              )}
            </div>
            <ShareSkeleton className={cn('invisible', 'desktop:visible')} />
          </section>

          {!isCtaHidden && <StickyBarSkeleton />}
        </div>
      </section>
    </main>
  );
}
