'use client';
import type { Region } from '@/types/region';
import { REGION_OPTIONS } from '@/types/region';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import SelectableChip from '@/components/ui/Chip/SelectableChip';

/**
 * @ 기사님 서비스 가능 지역 목록 컴포넌트
 */
export default function ServiceRegionList({
  serviceRegions,
}: {
  serviceRegions: Region[];
}) {
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
        {serviceRegions.map((serviceRegion) => {
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
