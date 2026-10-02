'use client';
import type { Region } from '@/types/region';
import { REGIONS } from '@/types/region';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import SelectableChip from '@/components/ui/Chip/SelectableChip';
import SectionTitle from '@/components/ui/SectionTitle';

/**
 * @ 기사님 서비스 가능 지역 목록 컴포넌트
 */
export default function ServiceRegionList({
  serviceRegions,
  className,
}: {
  serviceRegions: Region[];
  className?: string;
}) {
  const t = useTranslations('MoverDetail');
  const tRegion = useTranslations('Region');
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div className={cn(className)}>
      <SectionTitle>{t('serviceRegions')}</SectionTitle>
      <div
        className={cn(
          'grid grid-cols-[repeat(5,max-content)] gap-[8px]',
          'tablet:gap-[12px]',
        )}
      >
        {serviceRegions.map((serviceRegion) => {
          // 모르는 지역 값은 건너뛴다 (라벨은 messages > Region)
          if (!REGIONS.includes(serviceRegion)) return null;

          return (
            <SelectableChip
              key={serviceRegion}
              variant="default"
              size={currentBreakpoint}
              isSelected={false}
              className="cursor-default"
            >
              {tRegion(serviceRegion)}
            </SelectableChip>
          );
        })}
      </div>
    </div>
  );
}
