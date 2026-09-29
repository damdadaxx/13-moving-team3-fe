'use client';

import type { ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

/**
 * @ 기사님 제공 서비스 태그 목록 컴포넌트
 * - 기사님이 제공하는 서비스 태그를 목록으로 표시
 */
export default function ServiceTypeTagList({
  serviceTypes,
}: {
  serviceTypes: ServiceType[];
}) {
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div className={cn('flex gap-[8px] mb-[8px]', 'tablet:mb-[12px]')}>
      {serviceTypes.map((serviceType) => (
        <ServiceTypeTag
          key={serviceType}
          variant="service"
          serviceType={serviceType}
          size={currentBreakpoint}
        />
      ))}
    </div>
  );
}
