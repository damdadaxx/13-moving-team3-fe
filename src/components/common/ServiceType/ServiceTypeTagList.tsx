'use client';

import { EstimateStatus } from '@/types/estimate';
import type { ServiceType } from '@/types/serviceType';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import EstimateStatusBadge from '@/components/common/Estimate/EstimateStatusBadge';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

/**
 * @ 기사님 제공 서비스 태그 목록 컴포넌트
 * - 기사님이 제공하는 서비스 태그를 목록으로 표시
 */
export default function ServiceTypeTagList({
  serviceTypes,
  estimateStatus,
  className,
}: {
  serviceTypes: ServiceType[];
  estimateStatus?: EstimateStatus;
  className?: string;
}) {
  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div
      className={cn(
        estimateStatus ? 'flex justify-between items-center' : undefined,
        className,
      )}
    >
      <div className={cn('flex gap-[8px] flex-wrap')}>
        {serviceTypes.map((serviceType) => (
          <ServiceTypeTag
            key={serviceType}
            variant="service"
            serviceType={serviceType}
            size={currentBreakpoint}
          />
        ))}
      </div>
      {estimateStatus && (
        <EstimateStatusBadge
          status={estimateStatus}
          className={cn('tablet:hidden')}
        />
      )}
    </div>
  );
}
