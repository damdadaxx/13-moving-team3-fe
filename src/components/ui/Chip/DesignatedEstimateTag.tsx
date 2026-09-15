import IcSolidDocument from '@/assets/icons/ic_solid_document.svg';

import DisplayTagBase, { type DisplayTagSize } from './DisplayTagBase';

const DESIGNATED_ESTIMATE_TAG_WIDTH_CLASS_NAMES: Record<
  DisplayTagSize,
  string
> = {
  sm: 'w-[105px]',
  md: 'w-[116px]',
};

interface DesignatedEstimateTagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  size?: DisplayTagSize;
}

/*
@ 지정 견적 요청 표시 태그 사용 방법
- 클릭하거나 선택하는 버튼이 아닌 span 기반의 표시 전용 태그입니다.
- size="sm"은 26px, size="md"는 32px의 고정 높이를 사용합니다.
- 26 / 32 / 32 조합은 size="sm"과 tablet 기준 md 스타일을 className으로 전달합니다.
- 26 / 26 / 32 조합은 size="sm"과 desktop 기준 md 스타일을 className으로 전달합니다.
- 반응형 md 스타일의 너비는 116px입니다.

@ 최소 사용 예시
<DesignatedEstimateTag size="sm" />
<DesignatedEstimateTag size="md" />
*/

export default function DesignatedEstimateTag({
  size = 'sm',
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
