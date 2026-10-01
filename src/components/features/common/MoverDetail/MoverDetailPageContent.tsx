'use client';

import { useMoverDetailQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import MoverActionButtonGroup from '@/components/features/common/MoverDetail/MoverActionButtonGroup';
import MoverDetailTopSection from '@/components/features/common/MoverDetail/MoverDetailTopSection';
import MoverInfo from '@/components/features/common/MoverDetail/MoverInfo';
import MoverStickyActionBar from '@/components/features/common/MoverDetail/MoverStickyActionBar';
import ShareMoverInfo from '@/components/features/common/MoverDetail/ShareMoverInfo';
import MoverReviewList from '@/components/features/common/MoverReview/MoverReviewList';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/**
 * @ 기사님 상세 페이지 컨텐츠 컴포넌트
 * - 기사님 정보, 리뷰, 버튼 그룹
 */
export default function MoverDetailPageContent({
  moverId,
}: {
  moverId: string;
}) {
  const { data: mover, isPending, isError } = useMoverDetailQuery(moverId);

  if (isPending) {
    return <LoadingDisplay />;
  }

  if (isError || !mover) {
    return <EmptyState message="기사님 정보를 찾을 수 없어요." />;
  }

  return (
    <main className={cn('bg-gray-50')}>
      {/* 상단 섹션 */}
      <MoverDetailTopSection
        imageUrl={mover.imgUrl}
        nickname={mover.nickname}
      />

      {/* 정보 섹션 */}
      <section
        className={cn(
          'px-[20px] pb-[134px]',
          'tablet:pb-[126px] tablet:px-[72px]',
        )}
      >
        <div
          className={cn(
            'max-w-[1200px] mx-auto',
            'desktop:flex desktop:gap-[140px]',
          )}
        >
          <div className={cn('min-w-0', 'desktop:flex-1')}>
            {/* 기사님 정보 섹션 */}
            <MoverInfo mover={mover} />

            {/* 공유하기 */}
            <ShareMoverInfo
              className={cn(
                'pb-[32px] mb-[32px] border-b border-line-100',
                'desktop:hidden desktop:border-none',
              )}
            />

            {/* 리뷰섹션 */}
            <div className={cn('max-w-[1200px] mx-auto')}>
              <MoverReviewList key={mover.id} moverId={mover.id} />
            </div>
          </div>

          {/* 데스크탑 버튼 그룹 섹션 */}
          <section
            className={cn(
              'hidden',
              'desktop:block desktop:w-[calc(320/1200*100%)] desktop:max-w-[320px] desktop:px-0',
            )}
          >
            {/* 모바일 버튼 (찜하기, 지정 견적 요청하기) */}
            <MoverActionButtonGroup
              className="w-full mb-[70px]"
              moverId={mover.id}
              nickname={mover.nickname}
              likeCount={mover.likeCount}
            />

            {/* 공유하기 */}
            <ShareMoverInfo />
          </section>

          {/* 모바일, 테스크탑 버튼 그룹 섹션 */}
          <MoverStickyActionBar
            moverId={mover.id}
            likeCount={mover.likeCount}
          />
        </div>
      </section>
    </main>
  );
}
