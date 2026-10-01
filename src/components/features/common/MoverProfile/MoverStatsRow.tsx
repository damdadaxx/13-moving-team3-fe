import IcStarFill from '@/assets/icons/ic_star_fill.svg';

import { cn } from '@/utils/cn';
import { formatCareerLabel, formatRating } from '@/utils/formatMover';

function Divider() {
  return <span aria-hidden className="h-[14px] w-px bg-line-100" />;
}

/**
 * @ 기사님 평점·경력·확정 건수 한 줄 요약 컴포넌트
 * - 별점(리뷰수) | 경력 | 확정 건수를 구분선으로 나눠 한 줄로 표시
 */
export default function MoverStatsRow({
  averageRating,
  reviewCount,
  careerMonths,
  confirmedCount,
  className,
}: {
  averageRating: number;
  reviewCount: number;
  careerMonths: number;
  confirmedCount: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-[8px]', className)}>
      {/* 별점 */}
      <p className="flex items-center gap-[2px] text-md-semibold text-black-300">
        <IcStarFill aria-hidden className="h-[20px] w-[20px] text-yellow-100" />
        {formatRating(averageRating)}
        <span className="ml-[2px] text-md-medium text-gray-300">
          ({reviewCount})
        </span>
      </p>

      {/* 경력 */}
      <p className="flex items-center gap-[8px] text-md-semibold text-black-300">
        <Divider />
        <span className="text-md-medium text-gray-300">경력</span>
        {formatCareerLabel(careerMonths)}
      </p>

      {/* 확정 건수 */}
      <p className="flex items-center gap-[8px] text-md-semibold text-black-300">
        <Divider />
        {`${confirmedCount}건 `}
        <span className="text-md-medium text-gray-300">확정</span>
      </p>
    </div>
  );
}
