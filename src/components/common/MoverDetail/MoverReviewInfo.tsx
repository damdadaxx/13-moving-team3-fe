import IcStarFill from '@/assets/icons/ic_star_fill.svg';

import { cn } from '@/utils/cn';
import { formatCareerLabel, formatRating } from '@/utils/formatMover';

const GROUP_CLASS = {
  wrap: 'flex flex-col items-center',
  title:
    'text-sm-regular text-gray-500 tablet:text-lg-regular tablet:text-black-300 tablet:mb-[4px]',
  value:
    'flex items-center gap-[2px] text-lg-semibold text-black-300 tablet:text-xl-bold',
} as const;

interface MoverReviewInfoProps {
  confirmedCount: number;
  averageRating: number;
  reviewCount: number;
  careerMonths: number;
}

export default function MoverReviewInfo({
  confirmedCount,
  averageRating,
  reviewCount,
  careerMonths,
}: MoverReviewInfoProps) {
  const stats = [
    { title: '진행', value: `${confirmedCount}건` },
    {
      title: '리뷰',
      value: (
        <>
          <IcStarFill
            aria-hidden
            className="h-[20px] w-[20px] text-yellow-100"
          />
          {formatRating(averageRating)}
          <span
            className={cn(
              'ml-[2px] text-md-medium text-gray-300',
              'tablet:ml-[6px] text-lg-medium ',
            )}
          >
            ({reviewCount})
          </span>
        </>
      ),
    },
    { title: '총 경력', value: formatCareerLabel(careerMonths) },
  ];

  return (
    <dl
      className={cn(
        'flex h-[95px] items-center justify-around rounded-[12px] border border-line-200',
        'tablet:h-[120px]',
      )}
    >
      {stats.map(({ title, value }) => (
        <div key={title} className={GROUP_CLASS.wrap}>
          <dt className={GROUP_CLASS.title}>{title}</dt>
          <dd className={GROUP_CLASS.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
