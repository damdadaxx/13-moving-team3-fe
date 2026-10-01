import { SERVICE_TYPE_LABELS, type ServiceType } from '@/types/serviceType';
import { cva } from 'class-variance-authority';

import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidCompany from '@/assets/icons/ic_solid_company.svg';
import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';
import IcSolidHome from '@/assets/icons/ic_solid_home.svg';

import { cn } from '@/utils/cn';

export type ServiceTypeTagVariant = 'service' | 'designatedEstimate';
export type ServiceTypeTagSize = 'sm' | 'md';

type ServiceTypeTagContent = ServiceType | 'DESIGNATED_ESTIMATE';

interface ServiceTypeTagConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

/*
@ 표시 태그 콘텐츠 설정
- 아이콘과 라벨처럼 CSS로 표현할 수 없는 콘텐츠만 설정 객체에서 관리합니다.
- 색상은 variant, 간격·높이·여백은 size에서 관리합니다.
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
- size는 sm(26px) / md(32px) 고정 크기만 제공합니다.
- 너비는 padding으로 라벨 길이에 맞춥니다.
- gap은 sm 2px, md 4px입니다. 서비스 타입과 지정 견적 모두 동일합니다.
- 반응형은 컴포넌트가 처리하지 않습니다. 사용처에서 useBreakpointValue로 size를 넘깁니다.
*/
export const serviceTypeTagVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap inline-flex w-fit',
    'drop-shadow-[4px_4px_4px_rgba(217,217,217,0.1)]',
  ],
  {
    variants: {
      variant: {
        service: 'bg-orange-100 text-orange-400',
        designatedEstimate: 'bg-red-100 text-red-200',
      },
      size: {
        sm: [
          'h-[26px] gap-[2px]',
          'rounded-[4px] py-[2px] px-[4px_7px]',
          'text-sm-semibold',
        ],
        md: [
          'h-[32px] gap-[4px]',
          'rounded-[6px] py-[4px] px-[5px_7px]',
          'text-md-semibold',
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

export type ServiceTypeTagProps =
  ServiceVariantProps | DesignatedEstimateVariantProps;

/*
@ 표시 태그 사용 방법
- 서비스 타입과 지정 견적 요청을 한 컴포넌트의 variant로 제공합니다.
- variant="service"일 때는 serviceType을 반드시 전달합니다.
- variant="designatedEstimate"일 때는 serviceType을 전달하지 않습니다.
- size는 sm(26px) / md(32px) 고정 크기만 제공합니다. 기본값은 sm입니다.
- 반응형은 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.
- 아이콘은 옆의 라벨과 같은 의미이므로 스크린 리더에서 숨깁니다.

@ 페이지별 크기 조합 (height · sm: 26px, md: 32px)
- 26 / 32 / 32: useBreakpointValue('sm', 'md', 'md')
  사용처: 내 견적 관리의 받았던 견적, 받았던 견적 상세, 기사님 찾기
- 26 / 26 / 32: useBreakpointValue('sm', 'sm', 'md')
  사용처: 작성 가능한 리뷰, 리뷰 쓰기 모달
- 26 / 26 / 26: size="sm"
  사용처: 내가 작성한 리뷰
- 32 / 32 / 32: size="md"
  사용처: 내 견적 관리의 확정 견적 상세

@ 최소 사용 예시
<ServiceTypeTag
  variant="service"
  serviceType="SMALL_MOVE"
  size={useBreakpointValue('sm', 'md', 'md')}
/>
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
      className={cn(serviceTypeTagVariants({ variant, size }), className)}
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
