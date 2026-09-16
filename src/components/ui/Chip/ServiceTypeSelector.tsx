'use client';

import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPES,
  type ServiceType,
} from '@/types/serviceType';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import SelectableChip, { type SelectableChipSize } from './SelectableChip';

/*
@ 서비스 타입 선택 버튼 너비 CVA
- SelectableChip이 공통 높이, padding, typography와 선택 상태를 담당합니다.
- 서비스 타입별 너비는 CSS 변수로 제공하고 size variant에서 반응형 너비를 적용합니다.
*/
export const serviceTypeButtonVariants = cva('', {
  variants: {
    serviceType: {
      SMALL_MOVE: '[--chip-sm-width:73px] [--chip-md-width:103px]',
      HOME_MOVE: '[--chip-sm-width:73px] [--chip-md-width:103px]',
      OFFICE_MOVE: '[--chip-sm-width:85px] [--chip-md-width:118px]',
    },
    size: {
      sm: 'w-[var(--chip-sm-width)]',
      md: 'w-[var(--chip-md-width)]',
      'sm-tablet-md':
        'w-[var(--chip-sm-width)] tablet:w-[var(--chip-md-width)]',
      'sm-desktop-md':
        'w-[var(--chip-sm-width)] desktop:w-[var(--chip-md-width)]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

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
- selectedServiceTypes에 현재 선택된 값 배열을 전달합니다.
- 선택이 변경되면 onChange로 새로운 ServiceType 배열을 전달합니다.
- size를 생략하면 모든 화면에서 sm 크기가 적용됩니다.

@ 최소 사용 예시
<ServiceTypeSelector
  selectedServiceTypes={selectedServiceTypes}
  onChange={setSelectedServiceTypes}
  size="sm-tablet-md"
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
          className={serviceTypeButtonVariants({ serviceType, size })}
          onClick={() => handleServiceTypeClick(serviceType)}
        >
          {SERVICE_TYPE_LABELS[serviceType]}
        </SelectableChip>
      ))}
    </div>
  );
}
