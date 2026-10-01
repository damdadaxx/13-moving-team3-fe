// 기사님 진행/리뷰/경력 정보 컴포넌트
import { cva, type VariantProps } from 'class-variance-authority';

import IcStarFill from '@/assets/icons/ic_star_fill.svg';

import { cn } from '@/utils/cn';
import { formatCareerLabel, formatRating } from '@/utils/formatMover';

import SectionTitle from '@/components/ui/SectionTitle';

const reviewInfoListVariants = cva(
  'flex items-center justify-between px-[40px] tablet:px-[calc(160/600*100%)] tablet:py-[29px] desktop:px-[calc(160/821*100%)]',
  {
    variants: {
      variant: {
        default: 'rounded-[12px] border border-line-200 bg-gray-50 py-[24px]',
        mypage:
          'rounded-[16px] border border-line-100 bg-background-100 py-[28px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const reviewInfoItemVariants = cva('flex flex-col items-center text-center', {
  variants: {
    variant: {
      default: '',
      mypage: 'tablet:gap-[4px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const reviewInfoTitleVariants = cva('', {
  variants: {
    variant: {
      default:
        'text-sm-regular text-gray-500 tablet:mb-[4px] tablet:text-lg-regular tablet:text-black-300',
      mypage: 'text-md-regular text-black-300 tablet:text-lg-regular',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const reviewInfoValueVariants = cva('', {
  variants: {
    variant: {
      default:
        'flex items-center gap-[2px] text-lg-semibold text-black-300 tablet:text-xl-bold',
      mypage: 'text-2lg-bold text-orange-400 tablet:text-xl-bold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface MoverReviewInfoProps extends VariantProps<
  typeof reviewInfoListVariants
> {
  confirmedCount: number;
  averageRating: number;
  /** default variant에서만 '(N)'으로 표시한다. mypage variant는 안 쓴다 */
  reviewCount?: number;
  careerMonths: number;
  label?: string;
  className?: string;
}

export default function MoverReviewInfo({
  confirmedCount,
  averageRating,
  reviewCount,
  careerMonths,
  label,
  variant = 'default',
  className,
}: MoverReviewInfoProps) {
  const stats = [
    { title: '진행', value: `${confirmedCount}건` },
    {
      title: '리뷰',
      value:
        variant === 'mypage' ? (
          formatRating(averageRating)
        ) : (
          <>
            <IcStarFill
              aria-hidden
              className="h-[20px] w-[20px] text-yellow-100"
            />
            {formatRating(averageRating)}
            <span className="ml-[2px] text-md-medium text-gray-300 tablet:ml-[6px] tablet:text-lg-medium">
              ({reviewCount})
            </span>
          </>
        ),
    },
    { title: '총 경력', value: formatCareerLabel(careerMonths) },
  ];

  return (
    <div className={cn(className)}>
      {label && <SectionTitle>{label}</SectionTitle>}

      <dl className={reviewInfoListVariants({ variant })}>
        {stats.map(({ title, value }) => (
          <div key={title} className={reviewInfoItemVariants({ variant })}>
            <dt className={reviewInfoTitleVariants({ variant })}>{title}</dt>
            <dd className={reviewInfoValueVariants({ variant })}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
