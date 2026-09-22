'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';

import ImgEmpty from '@/assets/images/img_empty.png';
import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

/*
@ EmptyState 일러스트
- 새 이미지는 여기에 src만 추가하면 variant로 고를 수 있다
- default는 Figma empty 크롭(240×196, 안쪽 260.633px + opacity-50)
*/
const EMPTY_STATE_IMAGES = {
  default: {
    src: ImgEmpty,
    frameClassName:
      'absolute top-[-16.29px] left-[-11.04px] size-[260.633px] opacity-50',
    imageClassName: 'object-cover',
  },
  beaver: {
    src: ImgEmptyBeaver,
    frameClassName: 'relative size-full',
    imageClassName: 'object-contain',
  },
} as const satisfies Record<
  string,
  {
    src: StaticImageData;
    frameClassName: string;
    imageClassName: string;
  }
>;

export type EmptyStateVariant = keyof typeof EMPTY_STATE_IMAGES;

interface EmptyStateBaseProps {
  message: string;
  variant?: EmptyStateVariant;
  /** true면 헤더 없는 전체 화면 높이 (global-error) */
  isFullViewport?: boolean;
}

type EmptyStateProps = EmptyStateBaseProps &
  (
    | { buttonLabel: string; href: string; onClick?: never }
    | { buttonLabel: string; href?: never; onClick: () => void }
    | { buttonLabel?: never; href?: never; onClick?: never }
  );

/*
@ EmptyState
- Figma img/Component/empty (sm/lg) 패턴
- 404·error·global-error에서 문구·CTA만 바꿔 사용
- variant로 캐릭터 이미지를 고른다
*/
export default function EmptyState({
  message,
  variant = 'default',
  buttonLabel,
  href,
  onClick,
  isFullViewport = false,
}: EmptyStateProps) {
  const buttonSize = useBreakpointValue('sm', 'lg', 'lg');
  const illustration = EMPTY_STATE_IMAGES[variant];

  return (
    <main
      className={cn(
        'flex items-center justify-center px-[24px]',
        isFullViewport
          ? 'min-h-dvh'
          : 'min-h-[calc(100dvh-54px)] desktop:min-h-[calc(100dvh-88px)]',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-[24px]',
          'tablet:gap-[32px]',
        )}
      >
        <div className="relative h-[196px] w-[240px] overflow-hidden">
          <div className={illustration.frameClassName}>
            <Image
              src={illustration.src}
              alt=""
              fill
              sizes="261px"
              priority
              className={illustration.imageClassName}
            />
          </div>
        </div>
        <h1
          className={cn(
            'text-center text-lg-regular text-gray-400',
            'tablet:text-xl-regular',
          )}
        >
          {message}
        </h1>
        {buttonLabel ? (
          <div
            className={cn(
              'flex items-center justify-center w-full',
              'tablet:w-[140px]',
            )}
          >
            {href ? (
              <Button href={href} size={buttonSize}>
                {buttonLabel}
              </Button>
            ) : (
              <Button onClick={onClick} size={buttonSize}>
                {buttonLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
