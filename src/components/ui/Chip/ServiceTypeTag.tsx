import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidCompany from '@/assets/icons/ic_solid_company.svg';
import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';
import IcSolidHome from '@/assets/icons/ic_solid_home.svg';

import { cn } from '@/utils/cn';

import { SERVICE_TYPE_LABELS, type ServiceType } from './serviceType';

/*
@ 표시 전용 Chip 사용 방법
- ServiceTypeTag는 이사 서비스 타입을 아이콘과 함께 표시합니다.
- DesignatedEstimateTag는 지정 견적 요청 여부를 표시합니다.
- 두 컴포넌트는 클릭하거나 선택하는 버튼이 아닌 span 기반의 표시 전용 태그입니다.
- size를 생략하면 모바일에서는 sm, tablet 이상에서는 md가 적용됩니다.
- 반응형 전환 없이 크기를 고정하려면 size="sm" 또는 size="md"를 전달합니다.
*/

type DisplayTagSize = 'sm' | 'md' | 'responsive';

interface DisplayTagBaseProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size: DisplayTagSize;
  colorClassName: string;
  smallGapClassName: string;
  widthClassName: string;
}

/*=================================================
표시 태그 공통 레이아웃
=================================================*/

function DisplayTagBase({
  label,
  icon: Icon,
  size,
  colorClassName,
  smallGapClassName,
  widthClassName,
  className,
  ...props
}: DisplayTagBaseProps) {
  /*
  @ 사이즈별 스타일
  - 사이즈에 따른 높이, 여백, 모서리와 글자 스타일을 한 곳에서 관리합니다.
  - responsive는 모바일의 sm 스타일을 기본으로 사용하고 tablet 이상에서 md로 변경됩니다.
  - Tailwind 반응형 클래스는 동적으로 조합하지 않고 완성된 문자열로 작성합니다.
  */
  const sizeClassNames: Record<DisplayTagSize, string> = {
    sm: cn(
      'h-[26px] rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
      'text-sm-semibold',
      smallGapClassName,
    ),
    md: cn(
      'h-[32px] gap-[4px] rounded-[6px] py-[4px] pr-[7px] pl-[5px]',
      'text-md-semibold',
    ),
    responsive: cn(
      'h-[26px] rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
      'text-sm-semibold',
      smallGapClassName,
      'tablet:h-[32px] tablet:gap-[4px] tablet:rounded-[6px]',
      'tablet:py-[4px] tablet:pl-[5px] tablet:text-md-semibold',
    ),
  };

  const sizeClassName = sizeClassNames[size];

  return (
    <span
      {...props}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap',
        'drop-shadow-[4px_4px_4px_rgba(217,217,217,0.1)]',
        colorClassName,
        sizeClassName,
        widthClassName,
        className,
      )}
    >
      {/* 아이콘과 label의 의미가 같으므로 스크린 리더의 중복 안내를 방지합니다. */}
      <Icon
        aria-hidden="true"
        focusable="false"
        className="size-[20px] shrink-0"
      />
      <span>{label}</span>
    </span>
  );
}

/*=================================================
서비스 타입 태그
=================================================*/

interface ServiceTypeTagConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  widthClassNames: Record<DisplayTagSize, string>;
}

/*
@ 서비스 타입별 설정
- 서비스 타입에 해당하는 아이콘과 사이즈별 너비를 관리합니다.
- Record<ServiceType, ...>을 사용하므로 ServiceType이 추가되면 누락된 설정을 확인할 수 있습니다.
- responsive는 모바일 너비를 기본으로 사용하고 tablet 이상에서 md 너비로 변경됩니다.
*/
const SERVICE_TYPE_TAG_CONFIG: Record<ServiceType, ServiceTypeTagConfig> = {
  SMALL_MOVE: {
    icon: IcSolidBox,
    widthClassNames: {
      sm: 'w-[78px]',
      md: 'w-[85px]',
      responsive: 'w-[78px] tablet:w-[85px]',
    },
  },
  HOME_MOVE: {
    icon: IcSolidHome,
    widthClassNames: {
      sm: 'w-[78px]',
      md: 'w-[85px]',
      responsive: 'w-[78px] tablet:w-[85px]',
    },
  },
  OFFICE_MOVE: {
    icon: IcSolidCompany,
    widthClassNames: {
      sm: 'w-[90px]',
      md: 'w-[97px]',
      responsive: 'w-[90px] tablet:w-[97px]',
    },
  },
};

interface ServiceTypeTagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  serviceType: ServiceType;
  size?: DisplayTagSize;
}

export default function ServiceTypeTag({
  serviceType,
  size = 'responsive',
  ...props
}: ServiceTypeTagProps) {
  const config = SERVICE_TYPE_TAG_CONFIG[serviceType];
  const Icon = config.icon;

  return (
    <DisplayTagBase
      {...props}
      label={SERVICE_TYPE_LABELS[serviceType]}
      icon={Icon}
      size={size}
      colorClassName="bg-orange-100 text-orange-400"
      smallGapClassName="gap-[2px]"
      widthClassName={config.widthClassNames[size]}
    />
  );
}

/*=================================================
지정 견적 요청 태그
=================================================*/

interface DesignatedEstimateTagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  size?: DisplayTagSize;
}

/*
@ 지정 견적 요청 태그 너비
- 서비스 타입에 따른 분기가 없으므로 사이즈별 너비만 별도의 룩업 객체로 관리합니다.
*/
const DESIGNATED_ESTIMATE_TAG_WIDTH_CLASS_NAMES: Record<
  DisplayTagSize,
  string
> = {
  sm: 'w-[105px]',
  md: 'w-[116px]',
  responsive: 'w-[105px] tablet:w-[116px]',
};

export function DesignatedEstimateTag({
  size = 'responsive',
  ...props
}: DesignatedEstimateTagProps) {
  return (
    <DisplayTagBase
      {...props}
      label="지정 견적 요청"
      icon={IcSolidDocument}
      size={size}
      colorClassName="bg-red-100 text-red-200"
      smallGapClassName="gap-0"
      widthClassName={DESIGNATED_ESTIMATE_TAG_WIDTH_CLASS_NAMES[size]}
    />
  );
}
