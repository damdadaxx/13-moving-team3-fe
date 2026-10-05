// [공용] 기사님 상세 스켈레톤
'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import MoverReviewListSkeleton from '@/components/features/common/MoverReview/MoverReviewListSkeleton';
import PageBanner from '@/components/ui/PageBanner';
import { Skeleton } from '@/components/ui/Skeleton';

/** @ 배너 위 프로필 이미지 자리표시 */
function ProfileSkeleton() {
  return (
    <section
      className={cn(
        'relative pb-[22px]',
        'tablet:pb-[23px]',
        'desktop:pb-[51px]',
      )}
    >
      <PageBanner />
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
    </section>
  );
}

/** @ 제공 서비스·지역 칩 자리표시 */
function ChipRowSkeleton({
  titleWidth,
  widths,
}: {
  titleWidth: number;
  widths: number[];
}) {
  return (
    <div>
      <Skeleton
        width={titleWidth}
        height={26}
        className={cn('mb-[8px]!', 'tablet:mb-[16px]! tablet:h-[32px]!')}
      />
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

/** @ 진행·리뷰·경력 요약 자리표시 */
function StatBoxSkeleton() {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-[12px] border border-line-200 bg-gray-50 px-[40px] py-[24px]',
        'tablet:px-[calc(160/600*100%)] tablet:py-[29px]',
        'desktop:px-[calc(160/821*100%)]',
      )}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex flex-col items-center gap-[4px]">
          <Skeleton width={40} height={16} className="tablet:h-[26px]!" />
          <Skeleton width={48} height={26} className="tablet:h-[32px]!" />
        </div>
      ))}
    </div>
  );
}

/** @ 기사님 소개·서비스 정보 자리표시 */
function MoverInfoSkeleton() {
  return (
    <div className={cn('mt-[13px]', 'tablet:mt-[23px]', 'desktop:mt-[31px]')}>
      <div className={cn('mb-[8px] flex gap-[8px]', 'tablet:mb-[12px]')}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            key={index}
            width={72}
            height={26}
            borderRadius={4}
            className="tablet:h-[32px]! tablet:rounded-[6px]!"
          />
        ))}
      </div>

      <Skeleton
        width="72%"
        height={26}
        className={cn('mb-[16px]!', 'tablet:mb-[20px]! tablet:h-[32px]!')}
      />

      <div
        className={cn(
          'mb-[16px] flex items-center justify-between',
          'tablet:mb-[20px]',
        )}
      >
        <Skeleton width={140} height={26} className="tablet:h-[32px]!" />
        <Skeleton width={36} height={24} />
      </div>

      <div
        className={cn(
          'mb-[32px] flex flex-col gap-[32px] border-b border-line-100 pb-[32px]',
          'desktop:gap-[40px]',
        )}
      >
        <StatBoxSkeleton />
        <ChipRowSkeleton titleWidth={88} widths={[88, 88, 104]} />
        <ChipRowSkeleton titleWidth={120} widths={[64, 64, 64]} />
      </div>
    </div>
  );
}

/** @ 공유 버튼 자리표시 */
function ShareSkeleton({ className }: { className?: string }) {
  return (
    <section className={cn('desktop:mt-[40px]', className)}>
      <Skeleton
        width={220}
        height={26}
        className={cn('mb-[12px]!', 'tablet:h-[32px]!', 'desktop:mb-[22px]!')}
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

/** @ 데스크탑 지정 견적·찜 버튼 자리표시 */
function ActionGroupSkeleton() {
  return (
    <div className="mb-[70px] w-full">
      <div className="mb-[16px] flex flex-col gap-[4px]">
        <Skeleton width="78%" height={26} />
        <Skeleton width="62%" height={26} />
      </div>
      <div className="flex w-full flex-col gap-[16px]">
        <Skeleton height={64} borderRadius={16} />
        <Skeleton height={54} borderRadius={16} />
      </div>
    </div>
  );
}

/** @ 모바일·태블릿 하단 고정 버튼 자리표시 */
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
 * @ 기사님 상세 페이지 스켈레톤
 * - 기사님 정보 조회 중에 상세 화면과 같은 자리만 보여 준다
 */
export default function MoverDetailSkeleton() {
  const t = useTranslations('Common');

  return (
    <main className="bg-gray-50" aria-busy="true" aria-label={t('loading')}>
      <ProfileSkeleton />

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
          <div className={cn('min-w-0', 'desktop:flex-1')}>
            <MoverInfoSkeleton />
            <ShareSkeleton
              className={cn(
                'mb-[32px] border-b border-line-100 pb-[32px]',
                'desktop:hidden',
              )}
            />
            <MoverReviewListSkeleton />
          </div>

          <section
            className={cn(
              'hidden',
              'desktop:block desktop:w-[calc(320/1200*100%)] desktop:max-w-[320px] desktop:px-0',
            )}
          >
            <ActionGroupSkeleton />
            <ShareSkeleton />
          </section>

          <StickyBarSkeleton />
        </div>
      </section>
    </main>
  );
}
