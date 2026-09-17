// 고객 프로필이 없을 때의 견적요청 화면
//
// 견적 요청은 CustomerProfile을 참조하므로(Prisma 외래 키), 프로필 없이 요청하면
// 백엔드가 404 "참조하는 데이터를 찾을 수 없습니다"로 막는다.
// 폼을 다 채운 뒤 그 문구를 보게 두지 말고, 들어올 때 바로 안내한다.
'use client';

import { ROUTES } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

export default function ProfileRequiredNotice() {
  // 진행 중 안내 화면과 같은 규격을 쓴다 ([[EstimateRequestInProgress]])
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');

  return (
    <div
      className={cn(
        'flex min-h-[calc(100dvh-108px)] flex-col items-center justify-center gap-[48px] bg-background-200 px-[24px]',
        'desktop:min-h-[calc(100dvh-184px)] desktop:gap-[32px]',
      )}
    >
      <p className="text-md-regular text-center text-gray-400 desktop:text-xl-regular">
        견적을 요청하려면 프로필 등록이 필요해요.
        <br />
        이사 지역과 서비스를 등록하고 맞춤 견적을 받아보세요.
      </p>

      <Button
        size={buttonSize}
        href={ROUTES.customerProfileNew}
        className="w-auto px-[24px]"
      >
        프로필 등록하러 가기
      </Button>
    </div>
  );
}
