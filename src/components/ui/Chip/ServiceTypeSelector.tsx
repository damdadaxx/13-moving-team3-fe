'use client';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPES,
  type ServiceType,
} from './serviceType';

/*
@ 이용 서비스 선택 사용 방법
- SMALL_MOVE, HOME_MOVE, OFFICE_MOVE를 복수 선택할 수 있습니다.
- selectedServiceTypes에 현재 선택된 값 배열을 전달합니다.
- 선택이 변경되면 onChange로 새로운 ServiceType 배열을 전달합니다.
- size를 생략하면 모바일은 sm, tablet 이상은 md가 적용됩니다.
*/

const SERVICE_TYPE_BUTTON_WIDTH_CLASS_NAMES: Record<
  ServiceType,
  Record<SelectableChipSize, string>
> = {
  SMALL_MOVE: {
    sm: 'w-[73px]',
    md: 'w-[103px]',
    responsive: 'w-[73px] tablet:w-[103px]',
  },
  HOME_MOVE: {
    sm: 'w-[73px]',
    md: 'w-[103px]',
    responsive: 'w-[73px] tablet:w-[103px]',
  },
  OFFICE_MOVE: {
    sm: 'w-[85px]',
    md: 'w-[118px]',
    responsive: 'w-[85px] tablet:w-[118px]',
  },
};

interface ServiceTypeSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  selectedServiceTypes: readonly ServiceType[];
  onChange: (serviceTypes: ServiceType[]) => void;
  size?: SelectableChipSize;
}

export default function ServiceTypeSelector({
  selectedServiceTypes,
  onChange,
  size = 'responsive',
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
          className={SERVICE_TYPE_BUTTON_WIDTH_CLASS_NAMES[serviceType][size]}
          onClick={() => handleServiceTypeClick(serviceType)}
        >
          {SERVICE_TYPE_LABELS[serviceType]}
        </SelectableChip>
      ))}
    </div>
  );
}
