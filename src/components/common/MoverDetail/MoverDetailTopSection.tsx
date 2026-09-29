// [공용] 기사님 상세 상단 섹션
import type { MoverListItem } from '@/types/mover';
import Image from 'next/image';

import ImgBg from '@/assets/images/mover-detail/page_mover_detail.png';
import ImgBgDesktop from '@/assets/images/mover-detail/page_mover_detail_desktop.png';
import ImgBgTablet from '@/assets/images/mover-detail/page_mover_detail_tablet.png';

import { cn } from '@/utils/cn';

import ProfileImage from '@/components/ui/ProfileImage';

export default function MoverDetailTopSection({
  imageUrl,
}: {
  imageUrl?: MoverListItem['imgUrl'];
}) {
  return (
    <div
      className={cn(
        'relative pb-[22px]',
        'tablet:pb-[23px]',
        'desktop:pb-[51px]',
      )}
    >
      <div
        className={cn(
          'h-[112px] w-full overflow-hidden',
          'tablet:h-[157px]',
          'desktop:h-[225px]',
        )}
      >
        {/* 배경 이미지 */}
        <div className="relative h-full w-full">
          <Image
            src={ImgBg}
            alt="기사님 상세"
            fill
            priority
            sizes="(min-width: 744px) 1px, 100vw"
            className="object-cover tablet:hidden"
          />
          <Image
            src={ImgBgTablet}
            alt="기사님 상세"
            fill
            sizes="(min-width: 1024px) 1px, (min-width: 744px) 100vw, 1px"
            className="hidden object-cover tablet:block desktop:hidden"
          />
          <Image
            src={ImgBgDesktop}
            alt="기사님 상세"
            fill
            sizes="(min-width: 1024px) 100vw, 1px"
            className="hidden object-cover desktop:block"
          />
        </div>
      </div>

      {/* 프로필 이미지 */}
      <div
        className={cn('absolute inset-0 z-10 px-[20px]', 'tablet:px-[72px]')}
      >
        <div className={cn('relative mx-auto h-full w-full max-w-[1200px]')}>
          <ProfileImage
            className={cn('absolute bottom-0 l-0 z-20')}
            imageUrl={imageUrl ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}
