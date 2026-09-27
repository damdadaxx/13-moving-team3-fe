import { cn } from '@/utils/cn';

import ShareButtonGroup from '@/components/common/MoverDetail/ShareButtonGroup';
import MoverNickname from '@/components/common/MoverProfile/MoverNickname';
import MoverStatsRow from '@/components/common/MoverProfile/MoverStatsRow';

/**
 * @ 기사님 닉네임, 별점 및 경력, 찜하기
 */
export default function MoverEstimateProfile({
  moverId,
  nickname,
  likeCount,
  averageRating,
  reviewCount,
  careerMonths,
  confirmedCount,
}: {
  moverId: string;
  nickname: string;
  likeCount: number;
  averageRating: number;
  reviewCount: number;
  careerMonths: number;
  confirmedCount: number;
}) {
  return (
    <div
      className={cn('pb-[12px] border-b border-line-100', 'tablet:pb-[20px]')}
    >
      <div className={cn('flex justify-between items-center mb-[8px]')}>
        {/* 기사님 닉네임 */}
        <MoverNickname nickname={nickname} />

        {/* 찜하기 */}
        <ShareButtonGroup moverId={moverId} likeCount={likeCount} />
      </div>

      {/* 기사님 통계 정보 */}
      <MoverStatsRow
        averageRating={averageRating}
        reviewCount={reviewCount}
        careerMonths={careerMonths}
        confirmedCount={confirmedCount}
      />
    </div>
  );
}
