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
  /** 리스트 첫 카드처럼 화면에 바로 보이는 경우에만 true — LCP 대상일 때 lazy 로딩을 건너뛴다 */
  priority?: boolean;
}

const DEFAULT_SIZES =
  '(min-width: 1024px) 134px, (min-width: 744px) 100px, 64px';

/*
@ 프로필 이미지
- 없거나 불러오지 못하면 NoImage
- /uploads 보정은 여기서만 한다. API가 이미 /api 를 붙인 값은 그대로 둔다
- CloudFront 이미지는 next.config.ts의 허용 도메인으로 최적화한다.
- 기존 /api 프록시 이미지는 쿠키 전달 방식이 달라지지 않도록 브라우저에서 직접 가져온다.
*/
export default function ProfileImage({
  imageUrl,
  alt = '',
  className,
  sizes = DEFAULT_SIZES,
  priority = false,
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
          unoptimized={resolvedUrl.startsWith('/api/')}
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailedUrl(resolvedUrl)}
        />
      ) : (
        <NoImage alt={alt} />
      )}
    </div>
  );
}
