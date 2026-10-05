// [페이지] 기사님 마이페이지 스켈레톤
'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import MoverReviewListSkeleton from '@/components/features/common/MoverReview/MoverReviewListSkeleton';
import PageBanner from '@/components/ui/PageBanner';
import { Skeleton } from '@/components/ui/Skeleton';

/** @ 프로필 수정·기본 정보 수정 버튼 자리표시 */
function ButtonGroupSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[12px]',
        'tablet:flex-row-reverse tablet:gap-[16px]',
        'desktop:flex-col desktop:gap-[16px]',
        className,
      )}
    >
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className={cn(
            'w-full',
            'tablet:min-w-0 tablet:flex-1',
            'desktop:flex-none',
          )}
        >
          <Skeleton
            height={54}
            borderRadius={12}
            className="tablet:h-[64px]! tablet:rounded-[16px]!"
          />
        </div>
      ))}
    </div>
  );
}

/** @ 섹션 제목 자리표시 */
function TitleSkeleton({ width }: { width: number }) {
  return (
    <Skeleton
      width={width}
      height={26}
      className={cn('mb-[8px]!', 'tablet:mb-[16px]! tablet:h-[32px]!')}
    />
  );
}

/** @ 활동 현황 자리표시 */
function ActivitySkeleton() {
  return (
    <div>
      <TitleSkeleton width={72} />
      <div
        className={cn(
          'flex items-center justify-between rounded-[16px] border border-line-100 bg-background-100 px-[40px] py-[28px]',
          'tablet:px-[calc(160/600*100%)] tablet:py-[29px]',
          'desktop:px-[calc(160/821*100%)]',
        )}
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col items-center gap-[4px]">
            <Skeleton width={40} height={24} className="tablet:h-[26px]!" />
            <Skeleton width={48} height={26} className="tablet:h-[32px]!" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** @ 칩 목록 자리표시 */
function ChipRowSkeleton({
  titleWidth,
  widths,
  className,
}: {
  titleWidth: number;
  widths: number[];
  className?: string;
}) {
  return (
    <div className={className}>
      <TitleSkeleton width={titleWidth} />
      <div className={cn('flex gap-[8px]', 'tablet:gap-[12px]')}>
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            width={width}
            height={36}
            borderRadius={100}
            className="tablet:h-[46px]!"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * @ 기사님 마이페이지 스켈레톤
 * - 기사님 정보 조회 중에 마이페이지와 같은 자리만 보여 준다
 */
export default function MoverMypageSkeleton() {
  const t = useTranslations('Common');

  return (
    <main
      className={cn('bg-gray-50 pb-[28px]', 'desktop:pb-[126px]')}
      aria-busy="true"
      aria-label={t('loading')}
    >
      <PageBanner />

      <section
        className={cn(
          'px-[20px] pt-[23px]',
          'tablet:px-[72px] tablet:pt-[46px]',
          'desktop:pt-[43px]',
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-[1200px]',
            'desktop:flex desktop:gap-[96px]',
          )}
        >
          <div className="flex-1">
            <div className="mb-[16px] flex items-end gap-[12px]">
              <Skeleton
                width={60}
                height={64}
                borderRadius={12}
                className="tablet:h-[85px]! tablet:w-[80px]! tablet:rounded-[20px]!"
              />
              <div className={cn('flex flex-col', 'tablet:gap-[8px]')}>
                <Skeleton
                  width={140}
                  height={23}
                  className={cn('mb-[4px]!', 'tablet:mb-0!')}
                />
                <Skeleton width={36} height={23} className="tablet:h-[26px]!" />
              </div>
            </div>

            <div
              className={cn(
                'pb-[28px]',
                'tablet:pb-[32px]',
                'desktop:mb-[32px] desktop:border-b desktop:border-line-100',
              )}
            >
              <Skeleton width="72%" height={26} className="mb-[12px]!" />
              <div className="flex flex-col gap-[4px]">
                <Skeleton height={24} className="tablet:h-[26px]!" />
                <Skeleton height={24} className="tablet:h-[26px]!" />
              </div>
            </div>

            <div
              className={cn(
                'flex min-w-0 flex-col gap-[24px]',
                'tablet:gap-[32px]',
                'desktop:flex-1 desktop:gap-[40px]',
              )}
            >
              <ButtonGroupSkeleton
                className={cn(
                  'border-b border-line-100 pb-[24px]',
                  'tablet:pb-[32px]',
                  'desktop:hidden',
                )}
              />

              <ActivitySkeleton />
              <ChipRowSkeleton titleWidth={88} widths={[88, 88, 104]} />
              <ChipRowSkeleton
                titleWidth={120}
                widths={[64, 64, 64]}
                className={cn(
                  'border-b border-line-100 pb-[24px]',
                  'tablet:pb-[32px]',
                  'desktop:pb-[40px]',
                )}
              />

              <MoverReviewListSkeleton />
            </div>
          </div>

          <ButtonGroupSkeleton
            className={cn(
              'hidden',
              'desktop:flex desktop:w-[320px] desktop:min-w-[320px] desktop:px-0 desktop:pt-[70px]',
            )}
          />
        </div>
      </section>
    </main>
  );
}
