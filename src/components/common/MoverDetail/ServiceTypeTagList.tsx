// 기사님 제공 서비스 태그 목록 컴포넌트
'use client';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

export default function ServiceTypeTagList() {
  // TODO: 기사님 제공 서비스 데이터 조회
  const SERVICE_TYPE_DATA = [
    'SMALL_MOVE',
    'HOME_MOVE',
    'DESIGNATED_ESTIMATE',
  ] as const;

  const currentBreakpoint = useBreakpointValue('sm', 'md', 'md');

  return (
    <div className={cn('flex gap-[8px] mb-[8px]', 'tablet:mb-[12px]')}>
      {SERVICE_TYPE_DATA.map((serviceType) =>
        serviceType === 'DESIGNATED_ESTIMATE' ? (
          <ServiceTypeTag
            key={serviceType}
            variant="designatedEstimate"
            size={currentBreakpoint}
          />
        ) : (
          <ServiceTypeTag
            key={serviceType}
            variant="service"
            serviceType={serviceType}
            size={currentBreakpoint}
          />
        ),
      )}
    </div>
  );
}
