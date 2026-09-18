// [메뉴] 헤더 모달 메뉴 > 찜한 기사님
// [페이지] 찜한 기사님
import LikedMoverList from '@/components/liked-movers/LikedMoverList';

export default function LikedMoverPage() {
  return (
    <main className="min-h-full bg-background-100">
      <div className=" px-[24px] py-[24px] pb-[52px] tablet:px-[72px] tablet:pb-[61px] desktop:pt-[32px] desktop:pb-[95px]">
        <div className={'mx-auto w-full max-w-[1200px] desktop:px-0'}>
          {/* 기사 목록 컴포넌트 호출 */}
          <LikedMoverList />
        </div>
      </div>
    </main>
  );
}
