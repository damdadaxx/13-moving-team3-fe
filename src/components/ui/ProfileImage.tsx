'use client';

import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import NoImage from '@/components/ui/NoImage';

interface ProfileImageProps {
  imageUrl?: string | null;
  alt?: string;
  className?: string;
  /** next/image sizes. 기본값은 상세 상단 프로필 크기 */
  sizes?: string;
}

const DEFAULT_SIZES =
  '(min-width: 1024px) 134px, (min-width: 744px) 100px, 64px';

/*
@ 프로필 이미지
- 없거나 불러오지 못하면 NoImage
- /uploads 보정은 여기서만 한다. API가 이미 /api 를 붙인 값은 그대로 둔다
*/
export default function ProfileImage({
  imageUrl,
  alt = '',
  className,
  sizes = DEFAULT_SIZES,
}: ProfileImageProps) {
  const resolvedUrl = resolveImageUrl(imageUrl ?? null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = resolvedUrl !== null && failedUrl !== resolvedUrl;

  return (
    <div
      className={cn(
        'relative size-[64px] shrink-0 overflow-hidden rounded-[12px]',
        className,
      )}
    >
      {showPhoto ? (
        <Image
          src={resolvedUrl}
          alt={alt}
          fill
          unoptimized // TODO: 업로드 호스트가 remotePatterns 추가 시 삭제
          sizes={sizes}
          className="object-cover"
          onError={() => setFailedUrl(resolvedUrl)}
        />
      ) : (
        <NoImage alt={alt} />
      )}
    </div>
  );
}
