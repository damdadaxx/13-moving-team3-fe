// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 / 반려 요청 탭메뉴
// 목록 스켈레톤 (SentEstimateCard / RejectedRequestCard 구조를 따른다)
import { cn } from '@/utils/cn';

import EstimateCard from '@/components/ui/EstimateCard';
import { Skeleton } from '@/components/ui/Skeleton';

const ESTIMATE_SKELETON_COUNT = 4;

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

/** @ EstimateRequestSummary(variant="card") 자리표시 */
function RequestSummarySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-col gap-[16px] desktop:gap-[24px]', className)}
    >
      {/* 칩 */}
      <div className="flex min-h-[34px] items-center gap-[8px]">
        <Skeleton width={72} height={26} borderRadius={6} />
        <Skeleton width={96} height={26} borderRadius={6} />
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
  );
}

/** @ 보낸 견적 카드: 요약 + 견적 금액 줄 */
function SentEstimateCardSkeleton() {
  return (
    <EstimateCard className="tablet:gap-[32px]">
      <RequestSummarySkeleton className="tablet:gap-[24px]" />

      {/* 견적 금액 (라벨 + 금액). 실제 카드와 같은 높이·윗선 */}
      <div
        className={cn(
          'flex h-[47px] items-end border-t border-line-200',
          'tablet:h-[52px]',
        )}
      >
        <div className="flex w-full items-center justify-between">
          <Skeleton width={64} height={20} />
          <Skeleton width={120} height={28} />
        </div>
      </div>
    </EstimateCard>
  );
}

/** @ 반려 요청 카드: 요약만 (실제 카드는 그 위에 반려 오버레이가 덮인다) */
function RejectedRequestCardSkeleton() {
  return (
    <EstimateCard>
      <RequestSummarySkeleton />
    </EstimateCard>
  );
}

interface MoverEstimateListSkeletonProps {
  /*
  @ variant
  - sent: 보낸 견적 조회 (견적 금액 줄 포함, 목록 간격 20/32/24)
  - rejected: 반려 요청 (요약만, 목록 간격 24)
  */
  variant: 'sent' | 'rejected';
}

/** @ 보낸 견적 / 반려 요청 목록 자리표시 (실제 목록과 같은 grid) */
export default function MoverEstimateListSkeleton({
  variant,
}: MoverEstimateListSkeletonProps) {
  const isSent = variant === 'sent';

  return (
    <div
      className={cn(
        'grid grid-cols-1 desktop:grid-cols-2',
        isSent
          ? 'gap-[20px] tablet:gap-[32px] desktop:gap-[24px]'
          : 'gap-[24px]',
      )}
    >
      {Array.from({ length: ESTIMATE_SKELETON_COUNT }, (_, index) =>
        isSent ? (
          <SentEstimateCardSkeleton key={index} />
        ) : (
          <RejectedRequestCardSkeleton key={index} />
        ),
      )}
    </div>
  );
}
