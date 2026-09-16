import { SERVICE_TYPE_LABELS, type ServiceType } from '@/types/serviceType';
import { cva } from 'class-variance-authority';

import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidCompany from '@/assets/icons/ic_solid_company.svg';
import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';
import IcSolidHome from '@/assets/icons/ic_solid_home.svg';

import { cn } from '@/utils/cn';

export type ServiceTypeTagVariant = 'service' | 'designatedEstimate';
export type ServiceTypeTagSize = 'sm' | 'md' | 'sm-tablet-md' | 'sm-desktop-md';

type ServiceTypeTagContent = ServiceType | 'DESIGNATED_ESTIMATE';

interface ServiceTypeTagConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

/*
@ 표시 태그 콘텐츠 설정
- 아이콘과 라벨처럼 CSS로 표현할 수 없는 콘텐츠만 설정 객체에서 관리합니다.
- 크기, 너비, 색상과 반응형 스타일은 serviceTypeTagVariants에서 관리합니다.
*/
const SERVICE_TYPE_TAG_CONFIG: Record<
  ServiceTypeTagContent,
  ServiceTypeTagConfig
> = {
  SMALL_MOVE: {
    icon: IcSolidBox,
    label: SERVICE_TYPE_LABELS.SMALL_MOVE,
  },
  HOME_MOVE: {
    icon: IcSolidHome,
    label: SERVICE_TYPE_LABELS.HOME_MOVE,
  },
  OFFICE_MOVE: {
    icon: IcSolidCompany,
    label: SERVICE_TYPE_LABELS.OFFICE_MOVE,
  },
  DESIGNATED_ESTIMATE: {
    icon: IcSolidDocument,
    label: '지정 견적 요청',
  },
};

/*
@ 표시 태그 CVA
- 공통 레이아웃, variant별 색상, 콘텐츠별 너비와 반응형 크기를 한 곳에서 관리합니다.
- content variant는 서비스 종류별 sm/md 너비를 CSS 변수로 제공합니다.
- size variant는 해당 CSS 변수를 사용해 고정 크기 또는 breakpoint별 크기를 적용합니다.
*/
export const serviceTypeTagVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap',
    'drop-shadow-[4px_4px_4px_rgba(217,217,217,0.1)]',
  ],
  {
    variants: {
      variant: {
        service: 'gap-[2px] bg-orange-100 text-orange-400',
        designatedEstimate: 'gap-0 bg-red-100 text-red-200',
      },
      content: {
        SMALL_MOVE: '[--tag-sm-width:78px] [--tag-md-width:85px]',
        HOME_MOVE: '[--tag-sm-width:78px] [--tag-md-width:85px]',
        OFFICE_MOVE: '[--tag-sm-width:90px] [--tag-md-width:97px]',
        DESIGNATED_ESTIMATE: '[--tag-sm-width:105px] [--tag-md-width:116px]',
      },
      size: {
        sm: [
          'h-[26px] w-[var(--tag-sm-width)]',
          'rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
          'text-sm-semibold',
        ],
        md: [
          'h-[32px] w-[var(--tag-md-width)] gap-[4px]',
          'rounded-[6px] py-[4px] pr-[7px] pl-[5px]',
          'text-md-semibold',
        ],
        'sm-tablet-md': [
          'h-[26px] w-[var(--tag-sm-width)]',
          'rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
          'text-sm-semibold',
          'tablet:h-[32px] tablet:w-[var(--tag-md-width)] tablet:gap-[4px]',
          'tablet:rounded-[6px] tablet:py-[4px] tablet:pr-[7px] tablet:pl-[5px]',
          'tablet:text-md-semibold',
        ],
        'sm-desktop-md': [
          'h-[26px] w-[var(--tag-sm-width)]',
          'rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
          'text-sm-semibold',
          'desktop:h-[32px] desktop:w-[var(--tag-md-width)] desktop:gap-[4px]',
          'desktop:rounded-[6px] desktop:py-[4px] desktop:pr-[7px] desktop:pl-[5px]',
          'desktop:text-md-semibold',
        ],
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

interface ServiceTypeTagBaseProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  size?: ServiceTypeTagSize;
}

interface ServiceVariantProps extends ServiceTypeTagBaseProps {
  variant: 'service';
  serviceType: ServiceType;
}

interface DesignatedEstimateVariantProps extends ServiceTypeTagBaseProps {
  variant: 'designatedEstimate';
  serviceType?: never;
}

type ServiceTypeTagProps = ServiceVariantProps | DesignatedEstimateVariantProps;

/*
@ 표시 태그 사용 방법
- 서비스 타입과 지정 견적 요청을 한 컴포넌트의 variant로 제공합니다.
- variant="service"일 때는 serviceType을 반드시 전달합니다.
- variant="designatedEstimate"일 때는 serviceType을 전달하지 않습니다.
- 아이콘은 옆의 라벨과 같은 의미이므로 스크린 리더에서 숨깁니다.

@ size별 반응형 조합
- sm: mobile 26px / tablet 26px / desktop 26px
- md: mobile 32px / tablet 32px / desktop 32px
- sm-tablet-md: mobile 26px / tablet 32px / desktop 32px
- sm-desktop-md: mobile 26px / tablet 26px / desktop 32px

@ 최소 사용 예시
// 서비스 타입: tablet부터 md 크기로 변경
<ServiceTypeTag
  variant="service"
  serviceType="SMALL_MOVE"
  size="sm-tablet-md"
/>

// 지정 견적 요청: 모든 화면에서 md 크기 사용
<ServiceTypeTag variant="designatedEstimate" size="md" />
*/
export default function ServiceTypeTag({
  variant,
  serviceType,
  size = 'sm',
  className,
  ...props
}: ServiceTypeTagProps) {
  const content: ServiceTypeTagContent =
    variant === 'service' ? serviceType : 'DESIGNATED_ESTIMATE';
  const config = SERVICE_TYPE_TAG_CONFIG[content];
  const Icon = config.icon;

  return (
    <span
      {...props}
      className={cn(
        serviceTypeTagVariants({ variant, content, size }),
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        focusable="false"
        className="size-[20px] shrink-0"
      />
      <span>{config.label}</span>
    </span>
  );
}
