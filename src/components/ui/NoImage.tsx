// 이미지가 없을 때 쓰는 기본 이미지. 크기는 부모나 className으로 정한다.
import Image from 'next/image';

import ImgDefaultProfile from '@/assets/images/img_default_profile.png';

import { cn } from '@/utils/cn';

export default function NoImage({
  alt = '',
  className,
}: {
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative size-full overflow-hidden', className)}>
      <Image
        src={ImgDefaultProfile}
        alt={alt}
        fill
        sizes="256px"
        className="object-cover"
      />
    </div>
  );
}
