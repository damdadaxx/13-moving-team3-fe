// [메뉴] 헤더 모달 메뉴 > 이사 리뷰 > 작성 가능한 리뷰 탭메뉴
// [페이지] 작성 가능한 리뷰
import { pageMetadata } from '@/lib/constants/site';

import PendingReviewList from '@/components/features/customer/Review/PendingReviewList';

export const generateMetadata = pageMetadata(
  'reviewsPending',
  '/customer/reviews/pending',
);

export default function ReviewPendingPage() {
  return (
    <main>
      <div className="px-[24px] pt-[40px] pb-[52px] tablet:px-[72px] tablet:pb-[61px] desktop:pt-[54px] desktop:pb-[95px]">
        <div className="mx-auto w-full max-w-[1120px] desktop:px-0">
          <PendingReviewList />
        </div>
      </div>
    </main>
  );
}
