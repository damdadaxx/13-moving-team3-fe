// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 상세
import { cn } from '@/utils/cn';

import MoverActionButtonGroup from '@/components/common/MoverDetail/MoverDetailButtonGroups';
import MoverDetailTopSection from '@/components/common/MoverDetail/MoverDetailTopSection';
import MoverInfo from '@/components/common/MoverDetail/MoverInfo';
import MoverReviewList from '@/components/common/MoverDetail/MoverReviewList';
import ShareMoverInfo from '@/components/common/MoverDetail/ShareMoverInfo';
import Button from '@/components/ui/Button/Button';
import ButtonIcon from '@/components/ui/Button/ButtonIcon';
import Pagination from '@/components/ui/Pagination';

export default function MoverDetailPage() {
  return (
    <main className={cn('bg-gray-50 pb-[28px]', 'desktop:pb-[126px]')}>
      {/* 상단 섹션 */}
      <MoverDetailTopSection />

      {/* 정보 섹션 */}
      <section className={cn('px-[20px]', 'tablet:px-[72px]')}>
        <div
          className={cn(
            'desktop:flex desktop:gap-[140px] max-w-[1200px] mx-auto',
          )}
        >
          <div className={cn('min-w-0 desktop:flex-1')}>
            {/* 기사님 정보 섹션 */}
            <MoverInfo />

            {/* 공유하기 */}
            <ShareMoverInfo className={cn('desktop:hidden')} />

            {/* 리뷰섹션 */}
            <div className={cn('max-w-[1200px] mx-auto')}>
              <MoverReviewList />

              {/* 페이지네이션 */}
              <Pagination
                className={cn(
                  'mt-[24px] justify-center',
                  'tablet:mt-[46px]',
                  'desktop:mt-[48px]',
                )}
                currentPage={1}
                totalPages={10}
              />
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
            <MoverActionButtonGroup className="w-full mb-[70px]" />

            {/* 공유하기 */}
            <ShareMoverInfo />
          </section>

          {/* 모바일, 테스크탑 버튼 그룹 섹션 */}
          <section
            className={cn(
              'flex items-center gap-[8px] mt-[53px]',
              'tablet:mt-[72px]',
              'desktop:hidden',
            )}
          >
            <ButtonIcon variant="like" size="md" />
            <Button variant="solid" size="sm">
              지정 견적 요청하기
            </Button>
          </section>
        </div>
      </section>
    </main>
  );
}
