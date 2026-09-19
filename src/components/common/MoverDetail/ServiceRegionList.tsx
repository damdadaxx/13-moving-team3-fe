// 기사님 서비스 가능 지역 목록 컴포넌트
'use client';
import { REGION_OPTIONS } from '@/types/region';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import SelectableChip from '@/components/ui/Chip/SelectableChip';

export default function ServiceRegionList() {
  // TODO: 기사님 서비스 가능 지역 데이터 조회
  const SERVICE_REGION_DATA = ['SEOUL', 'GYEONGGI'];
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div>
      <h2
        className={cn(
          'mb-[8px] text-lg-semibold text-black-400',
          'tablet:mb-[16px] tablet:text-xl-semibold',
        )}
      >
        서비스 가능 지역
      </h2>
      <div
        className={cn(
          'grid grid-cols-[repeat(5,max-content)] gap-[8px]',
          'tablet:gap-[12px]',
        )}
      >
        {SERVICE_REGION_DATA.map((serviceRegion) => {
          const region = REGION_OPTIONS.find(
            (option) => option.value === serviceRegion,
          );
          if (!region) return null;

          return (
            <SelectableChip
              key={region.value}
              variant="default"
              size={currentBreakpoint}
              isSelected={false}
              className="cursor-default"
            >
              {region.label}
            </SelectableChip>
          );
        })}
      </div>
    </div>
  );
}
