import { SERVICE_TYPE_LABELS, type ServiceType } from '@/types/serviceType';

import IcSolidBox from '@/assets/icons/ic_solid_box.svg';
import IcSolidCompany from '@/assets/icons/ic_solid_company.svg';
import IcSolidHome from '@/assets/icons/ic_solid_home.svg';

import DisplayTagBase, { type DisplayTagSize } from './DisplayTagBase';

interface ServiceTypeTagConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  widthClassNames: Record<DisplayTagSize, string>;
}

/*
@ 서비스 타입별 설정
- 서비스 타입에 해당하는 아이콘과 sm, md 고정 너비를 관리합니다.
- Record<ServiceType, ...>을 사용하므로 ServiceType이 추가되면 누락된 설정을 확인할 수 있습니다.
*/
const SERVICE_TYPE_TAG_CONFIG: Record<ServiceType, ServiceTypeTagConfig> = {
  SMALL_MOVE: {
    icon: IcSolidBox,
    widthClassNames: {
      sm: 'w-[78px]',
      md: 'w-[85px]',
    },
  },
  HOME_MOVE: {
    icon: IcSolidHome,
    widthClassNames: {
      sm: 'w-[78px]',
      md: 'w-[85px]',
    },
  },
  OFFICE_MOVE: {
    icon: IcSolidCompany,
    widthClassNames: {
      sm: 'w-[90px]',
      md: 'w-[97px]',
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

/*
@ 서비스 타입 표시 태그 사용 방법
- 이사 서비스 타입을 아이콘과 함께 보여주는 span 기반의 표시 전용 태그입니다.
- size="sm"은 26px, size="md"는 32px의 고정 높이를 사용합니다.
- 컴포넌트 내부에서는 breakpoint를 결정하지 않으며 페이지별 반응형 조합은 className으로 전달합니다.

@ 페이지별 크기 조합
- 26 / 32 / 32: size="sm" + tablet부터 md 스타일
  사용처: 내 견적 관리의 받았던 견적, 받았던 견적 상세, 기사님 찾기
- 26 / 26 / 32: size="sm" + desktop부터 md 스타일
  사용처: 작성 가능한 리뷰, 리뷰 쓰기 모달
- 26 / 26 / 26: size="sm"
  사용처: 내가 작성한 리뷰
- 32 / 32 / 32: size="md"
  사용처: 내 견적 관리의 확정 견적 상세

@ 반응형 className 작성 시 주의
- sm에서 md로 바뀌는 높이, 너비, gap, radius, padding과 typography를 함께 변경해야 합니다.
- SMALL_MOVE와 HOME_MOVE의 md 너비는 85px, OFFICE_MOVE의 md 너비는 97px입니다.
- 예: SMALL_MOVE를 tablet부터 md로 변경
  className="tablet:h-[32px] tablet:w-[85px] tablet:gap-[4px] tablet:rounded-[6px]
  tablet:py-[4px] tablet:pl-[5px] tablet:text-md-semibold"

@ 최소 사용 예시
<ServiceTypeTag serviceType="SMALL_MOVE" size="sm" />
<ServiceTypeTag serviceType="SMALL_MOVE" size="md" />
*/

export default function ServiceTypeTag({
  serviceType,
  size = 'sm',
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
