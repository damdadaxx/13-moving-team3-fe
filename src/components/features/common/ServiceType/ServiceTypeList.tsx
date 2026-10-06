'use client';

import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import SelectableChip from '@/components/ui/Chip/SelectableChip';
import SectionTitle from '@/components/ui/SectionTitle';

/**
 * @ 기사님 제공 서비스 목록 컴포넌트
 */
export default function ServiceTypeList({
  serviceTypes,
}: {
  serviceTypes: ServiceType[];
}) {
  const t = useTranslations('MoverDetail');
  const tServiceType = useTranslations('ServiceType');
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div>
      <SectionTitle>{t('serviceTypes')}</SectionTitle>
      <div className={cn('flex gap-[8px]', 'tablet:gap-[12px]')}>
        {serviceTypes.map((serviceType) => (
          <SelectableChip
            key={serviceType}
            variant="default"
            size={currentBreakpoint}
            isSelected={true}
            className="cursor-default"
          >
            {tServiceType(serviceType)}
          </SelectableChip>
        ))}
      </div>
    </div>
  );
}
