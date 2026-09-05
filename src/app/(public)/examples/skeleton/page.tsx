// [메뉴] 예시
// [페이지] Skeleton UI
import { Skeleton } from '@/components/ui/Skeleton';

export default function SkeletonExamplePage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <h1 className="text-[20px] font-bold">Skeleton 예시</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold">기본 (1줄)</h2>
        <Skeleton />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold">여러 줄 (count=3)</h2>
        <Skeleton count={3} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold">크기 지정</h2>
        <Skeleton width="120px" height="20px" />
        <Skeleton width="80%" height="16px" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold">원형 (프로필)</h2>
        <Skeleton width={48} height={48} borderRadius="50%" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[16px] font-semibold">카드 레이아웃</h2>
        <div className="flex items-center gap-3">
          <Skeleton width={48} height={48} borderRadius="50%" />
          <div className="flex-1">
            <Skeleton width="40%" height="16px" count={2} />
            <Skeleton height="14px" />
          </div>
        </div>
      </section>
    </div>
  );
}
