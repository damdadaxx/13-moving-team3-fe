// [메뉴] 헤더 모달 메뉴 > 이사 리뷰 > 내가 작성한 리뷰 탭메뉴
// [페이지] 내가 작성한 리뷰
import CompletedReviewList from '@/components/features/customer/Review/CompletedReviewList';

export default function ReviewCompletePage() {
  return (
    <main>
      <div className="px-[24px] pt-[40px] pb-[52px] tablet:px-[72px] tablet:pb-[61px] desktop:pt-[54px] desktop:pb-[95px]">
        <div className="mx-auto w-full min-w-0 desktop:max-w-[1120px]">
          <CompletedReviewList />
        </div>
      </div>
    </main>
  );
}
