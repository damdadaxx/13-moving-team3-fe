// 진행 중인 견적이 있을 때의 견적요청 화면 (Figma: 견적요청_disabled, node 1:7659)
// 고객당 진행 중인 요청은 1건뿐이라, 새 요청 대신 안내와 받은 견적으로 가는 CTA만 보여준다.
'use client';

import Image from 'next/image';

import imgMovingCar from '@/assets/images/img_moving_car.png';

import { ROUTES } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

export default function EstimateRequestInProgress() {
  // 시안상 CTA 높이가 모바일·태블릿 54, 데스크톱 64다
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');

  return (
    <div
      className={cn(
        'flex min-h-[calc(100dvh-108px)] flex-col items-center justify-center gap-[48px] bg-background-200 px-[24px]',
        'desktop:min-h-[calc(100dvh-184px)] desktop:gap-[32px]',
      )}
    >
      <div className="flex flex-col items-center">
        {/* 데스크톱 시안에서만 트럭이 살짝 오른쪽으로 치우쳐 있다 */}
        <div className="flex items-center justify-center desktop:pl-[24px]">
          <Image
            src={imgMovingCar}
            alt=""
            className="h-[180px] w-[181px] object-contain opacity-30 desktop:size-[280px]"
          />
        </div>
        <p className="text-md-regular text-center text-gray-400 desktop:text-xl-regular">
          현재 진행 중인 이사 견적이 있어요!
          <br />
          진행 중인 이사 완료 후 새로운 견적을 받아보세요.
        </p>
      </div>

      {/* 폭은 문구에 맞춘다 (Button 기본이 w-full이라 w-auto로 되돌린다) */}
      <Button
        size={buttonSize}
        href={ROUTES.customerEstimates}
        className="w-auto px-[24px]"
      >
        받은 견적 보러가기
      </Button>
    </div>
  );
}
