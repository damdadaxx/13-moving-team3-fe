// [메뉴] 헤더 모달 메뉴 > 이사 리뷰 > 작성 가능한 리뷰 탭메뉴
// [페이지] 작성 가능한 리뷰
import PendingReviewList from '@/components/reviews/PendingReviewList';

export default function ReviewPendingPage() {
  return (
    <main>
      <div className="px-[24px] py-[24px] pb-[52px] tablet:px-[72px] tablet:pb-[61px] desktop:pt-[32px] desktop:pb-[95px]">
        <div className="mx-auto w-full max-w-[1120px] desktop:px-0">
          <PendingReviewList />
        </div>
      </div>
    </main>
  );
}
