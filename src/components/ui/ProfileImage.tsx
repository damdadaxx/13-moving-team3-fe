import Image from 'next/image';

import ImgDefaultProfile from '@/assets/images/img_default_profile.png';

import { cn } from '@/utils/cn';

export default function ProfileImage({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative size-[64px] overflow-hidden rounded-[12px]',
        'tablet:size-[100px]',
        'desktop:size-[134px]',
        className,
      )}
    >
      <Image
        src={imageUrl || ImgDefaultProfile.src}
        alt="기사님 상세"
        fill
        sizes="(min-width: 1024px) 134px, (min-width: 744px) 100px, 64px"
        className={cn('object-cover')}
      />
    </div>
  );
}
