'use client';

import { useMoverDetailQuery } from '@/hooks/queries/movers/queries';

import { cn } from '@/utils/cn';

import DesignatedEstimateRequestButton from '@/components/common/MoverDetail/DesignatedEstimateRequestButton';
import MoverActionButtonGroup from '@/components/common/MoverDetail/MoverDetailButtonGroups';
import MoverDetailTopSection from '@/components/common/MoverDetail/MoverDetailTopSection';
import MoverInfo from '@/components/common/MoverDetail/MoverInfo';
import MoverLikeIconButton from '@/components/common/MoverDetail/MoverLikeIconButton';
import ShareMoverInfo from '@/components/common/MoverDetail/ShareMoverInfo';
import MoverReviewList from '@/components/common/MoverReview/MoverReviewList';
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
          'tablet:pb-[150px] tablet:px-[72px]',
        )}
      >
        <div
          className={cn(
            'desktop:flex desktop:gap-[140px] max-w-[1200px] mx-auto',
          )}
        >
          <div className={cn('min-w-0 desktop:flex-1')}>
            {/* 기사님 정보 섹션 */}
            <MoverInfo mover={mover} />

            {/* 공유하기 */}
            <ShareMoverInfo className={cn('desktop:hidden')} />

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
          <section
            className={cn(
              'fixed bottom-0 left-0 right-0 px-[20px] py-[28px] bg-gray-50 border-t border-line-200',
              'tablet:px-[72px]',
              'desktop:hidden',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-[8px] max-w-[1200px] mx-auto',
              )}
            >
              <MoverLikeIconButton
                moverId={mover.id}
                likeCount={mover.likeCount}
              />
              <DesignatedEstimateRequestButton
                moverId={mover.id}
                size="sm"
                className="flex-1"
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
