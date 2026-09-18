// 이사 견적 요청 섹션 컴포넌트
import Image from 'next/image';

import ImgEstimateRequestMobile from '@/assets/images/landing/img_estimate_request.jpg';
import ImgEstimateRequestDesktop from '@/assets/images/landing/img_estimate_request_desktop.jpg';
import ImgEstimateRequestTablet from '@/assets/images/landing/img_estimate_request_tablet.jpg';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

export default function EstimateRequestSection() {
  /*
  @ 이사 견적 요청 이미지
  - 마운트 전에는 mobile 이미지를 보여주고, 마운트 후 실제 브레이크포인트 이미지로 바꾼다.
  */
  const estimateRequestImage = useBreakpointValue(
    ImgEstimateRequestMobile,
    ImgEstimateRequestTablet,
    ImgEstimateRequestDesktop,
  );

  return (
    <section
      className={cn(
        'mb-[16.5px]',
        'tablet:px-[32px] tablet:mb-[36px]',
        'desktop:mb-[61px]',
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          'aspect-[1125/1488]',
          'tablet:mx-auto tablet:max-w-[1402px] tablet:aspect-[679/835]',
          'desktop:aspect-[4206/2360]',
        )}
      >
        <Image
          className={cn('object-cover')}
          src={estimateRequestImage}
          alt="이사 견적 요청 이미지"
          fill
          sizes="(min-width: 744px) 1402px, 100vw"
        />
        <h2
          className={cn(
            // text-xl-bold
            'absolute top-[clamp(29px,5.072vw+10.739px,50px)] right-[clamp(32px,2.415vw+23.304px,42px)] text-gray-50 text-right text-[clamp(20px,2.899vw+9.565px,32px)] font-bold leading-[calc(32/20)]',
            // text-3xl-bold
            'tablet:text-3xl-bold tablet:leading-[calc(42/32)] tablet:top-[clamp(49px,7.752vw,58px)] tablet:right-[clamp(53px,9.432vw,63px)]',
            'desktop:top-[clamp(49px,11.625vw-70.045px,152px)] desktop:right-[clamp(53px,24.266vw-195.489px,268px)] desktop:text-left',
          )}
        >
          원하는 이사 서비스를 요청하고
          <br /> 견적을 받아보세요
        </h2>
      </div>
    </section>
  );
}
