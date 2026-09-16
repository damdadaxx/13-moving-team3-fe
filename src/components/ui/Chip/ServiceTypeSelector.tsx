'use client';

import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPES,
  type ServiceType,
} from '@/types/serviceType';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';

interface ServiceTypeSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  selectedServiceTypes: readonly ServiceType[];
  onChange: (serviceTypes: ServiceType[]) => void;
  size?: SelectableChipSize;
}

/*
@ 이용 서비스 선택 사용 방법
- SMALL_MOVE, HOME_MOVE, OFFICE_MOVE를 복수 선택할 수 있습니다.
- RegionChipGroup과 달리 복수 선택 토글이 컴포넌트 안에 있습니다.
- selectedServiceTypes에 현재 선택된 값 배열을 전달합니다.
- 선택이 변경되면 onChange로 새로운 ServiceType 배열을 전달합니다.
- size는 sm / md 고정 크기만 제공합니다. 기본값은 sm입니다.
- 너비는 SelectableChip padding으로 라벨 길이에 맞춥니다.
- 반응형은 사용처에서 useBreakpointValue로 size를 바꿔 전달합니다.

@ 최소 사용 예시
const size = useBreakpointValue({
  mobile: 'sm',
  tablet: 'md',
  desktop: 'md',
});

<ServiceTypeSelector
  selectedServiceTypes={selectedServiceTypes}
  onChange={setSelectedServiceTypes}
  size={size}
/>
*/
export default function ServiceTypeSelector({
  selectedServiceTypes,
  onChange,
  size = 'sm',
  className,
  ...props
}: ServiceTypeSelectorProps) {
  function handleServiceTypeClick(serviceType: ServiceType) {
    const isSelected = selectedServiceTypes.includes(serviceType);

    const nextServiceTypes = isSelected
      ? selectedServiceTypes.filter(
          (selectedServiceType) => selectedServiceType !== serviceType,
        )
      : [...selectedServiceTypes, serviceType];

    onChange(nextServiceTypes);
  }

  return (
    <div
      {...props}
      role="group"
      aria-label="이용 서비스 선택"
      className={cn('flex flex-wrap gap-[8px]', className)}
    >
      {SERVICE_TYPES.map((serviceType) => (
        <SelectableChip
          key={serviceType}
          size={size}
          isSelected={selectedServiceTypes.includes(serviceType)}
          onClick={() => handleServiceTypeClick(serviceType)}
        >
          {SERVICE_TYPE_LABELS[serviceType]}
        </SelectableChip>
      ))}
    </div>
  );
}
