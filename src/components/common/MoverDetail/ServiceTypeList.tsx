// 기사님 제공 서비스 목록 컴포넌트
'use client';

import { SERVICE_TYPE_LABELS } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import SelectableChip from '@/components/ui/Chip/SelectableChip';

export default function ServiceTypeList() {
  // TODO: 기사님 제공 서비스 데이터 조회
  const SERVICE_TYPE_DATA = [
    'SMALL_MOVE',
    'HOME_MOVE',
    'DESIGNATED_ESTIMATE',
  ] as const;
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div>
      <h2
        className={cn(
          'mb-[8px] text-lg-semibold text-black-400',
          'tablet:mb-[16px] tablet:text-xl-semibold',
        )}
      >
        제공 서비스
      </h2>
      <div className={cn('flex gap-[8px]', 'tablet:gap-[12px]')}>
        {SERVICE_TYPE_DATA.map((serviceType) => {
          if (serviceType === 'DESIGNATED_ESTIMATE') return null;

          return (
            <SelectableChip
              key={serviceType}
              variant="default"
              size={currentBreakpoint}
              isSelected={true}
              className="cursor-default"
            >
              {SERVICE_TYPE_LABELS[serviceType]}
            </SelectableChip>
          );
        })}
      </div>
    </div>
  );
}
