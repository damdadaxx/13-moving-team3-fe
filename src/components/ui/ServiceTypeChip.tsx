// 이사 유형 칩 (소형이사 / 가정이사 / 사무실이사)
// Figma: 디자인 시스템 > Chip/이사유형 (node 1:5892)
import type { ServiceType } from '@/types/mover';
import { cva, type VariantProps } from 'class-variance-authority';

import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidCompany from '@/assets/icons/ic_solid_company.svg';
import IcSolidHome from '@/assets/icons/ic_solid_home.svg';

import { SERVICE_TYPE_LABEL } from '@/lib/constants/mover';

import { cn } from '@/utils/cn';

/*
@ 사이즈
- sm / md: Figma size 그대로
- responsive: 모바일 sm → 태블릿부터 md (기사님 찾기 목록 카드)
- 배경: Figma에서 사무실이사 sm만 red-100, 나머지는 전부 orange-100
*/
const chipVariants = cva(
  'inline-flex shrink-0 items-center justify-center pr-[7px] text-orange-400 drop-shadow-[4px_4px_4px_rgb(217_217_217_/_0.1)]',
  {
    variants: {
      size: {
        sm: 'gap-0.5 rounded-sm py-0.5 pl-1 text-sm-semibold',
        md: 'gap-1 rounded-md py-1 pl-[5px] text-md-semibold',
        responsive:
          'gap-0.5 rounded-sm py-0.5 pl-1 text-sm-semibold tablet:gap-1 tablet:rounded-md tablet:py-1 tablet:pl-[5px] tablet:text-md-semibold',
      },
      isOffice: {
        true: '',
        false: 'bg-orange-100',
      },
    },
    compoundVariants: [
      { size: 'sm', isOffice: true, className: 'bg-red-100' },
      { size: 'md', isOffice: true, className: 'bg-orange-100' },
      {
        size: 'responsive',
        isOffice: true,
        className: 'bg-red-100 tablet:bg-orange-100',
      },
    ],
    defaultVariants: {
      size: 'sm',
      isOffice: false,
    },
  },
);

const ICONS = {
  SMALL_MOVE: IcSolidBox,
  HOME_MOVE: IcSolidHome,
  OFFICE_MOVE: IcSolidCompany,
} as const;

interface ServiceTypeChipProps {
  serviceType: ServiceType;
  size?: NonNullable<VariantProps<typeof chipVariants>['size']>;
  className?: string;
}

export default function ServiceTypeChip({
  serviceType,
  size = 'sm',
  className,
}: ServiceTypeChipProps) {
  const Icon = ICONS[serviceType];

  return (
    <span
      className={cn(
        chipVariants({ size, isOffice: serviceType === 'OFFICE_MOVE' }),
        className,
      )}
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {SERVICE_TYPE_LABEL[serviceType]}
    </span>
  );
}
