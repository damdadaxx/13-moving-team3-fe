// [메뉴] 받은 요청 메뉴
// 받은 요청 목록 스켈레톤 (ReceivedRequestCard 구조를 따른다)
import { cn } from '@/utils/cn';

import EstimateCard from '@/components/ui/EstimateCard';
import { Skeleton } from '@/components/ui/Skeleton';

const REQUEST_SKELETON_COUNT = 4;

/*
@ 글자 한 줄 자리표시
- 실제 글자의 줄 높이(lineHeight)만큼 자리를 잡고, 그 안에 막대를 세로 가운데 둔다
- 로딩이 끝나 실제 카드로 바뀔 때 카드 높이가 그대로라 아래 내용이 밀리지 않는다
*/
function TextLineSkeleton({
  width,
  barHeight,
  lineHeight,
}: {
  width: number;
  barHeight: number;
  lineHeight: number;
}) {
  return (
    <div className="flex items-center" style={{ height: lineHeight }}>
      <Skeleton width={width} height={barHeight} />
    </div>
  );
}

/** @ 출발지·도착지·이사일 한 칸 (라벨 text-md 24px + 값 text-lg 26px) */
function DetailSkeleton({ valueWidth }: { valueWidth: number }) {
  return (
    <div className="flex flex-col">
      <TextLineSkeleton width={40} barHeight={14} lineHeight={24} />
      <TextLineSkeleton width={valueWidth} barHeight={18} lineHeight={26} />
    </div>
  );
}

/** @ 받은 요청 카드 한 장 자리표시 */
function ReceivedRequestCardSkeleton() {
  return (
    <EstimateCard>
      <div className="flex flex-col gap-[16px] desktop:gap-[24px]">
        {/* 칩 + 상대 시간 */}
        <div className="flex min-h-[34px] items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <Skeleton width={72} height={26} borderRadius={6} />
            <Skeleton width={96} height={26} borderRadius={6} />
          </div>
          <TextLineSkeleton width={44} barHeight={14} lineHeight={24} />
        </div>

        {/* 고객 이름(text-xl 32px) + 구분선 */}
        <div className="flex flex-col gap-[12px]">
          <TextLineSkeleton width={120} barHeight={22} lineHeight={32} />
          <div className="h-px w-full bg-line-100" />
        </div>

        {/* 출발지 → 도착지 / 이사일 */}
        <div
          className={cn(
            'flex flex-col gap-[16px]',
            'tablet:flex-row tablet:items-start tablet:justify-between',
          )}
        >
          <div className="flex items-end gap-[40px]">
            <DetailSkeleton valueWidth={88} />
            <DetailSkeleton valueWidth={88} />
          </div>
          <DetailSkeleton valueWidth={150} />
        </div>
      </div>

      {/* 견적 보내기 / 반려하기 버튼 (mobile 세로, tablet~ 가로) */}
      <div className="flex w-full flex-col gap-[11px] tablet:flex-row">
        <Skeleton height={54} borderRadius={16} className="tablet:flex-1" />
        <Skeleton height={54} borderRadius={16} className="tablet:flex-1" />
      </div>
    </EstimateCard>
  );
}

/** @ 받은 요청 목록 자리표시 (실제 목록과 같은 grid) */
export default function ReceivedRequestListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-[24px] desktop:grid-cols-2">
      {Array.from({ length: REQUEST_SKELETON_COUNT }, (_, index) => (
        <ReceivedRequestCardSkeleton key={index} />
      ))}
    </div>
  );
}
