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

/*
@ 세로 높이
- page: 고정 헤더만 (54 / 88). body padding과 같다
- tab: 헤더 + 탭 (108 / 168)
- title: 헤더 + PageHeader (108 / 184)
- titleAndTab: 헤더 + PageHeader + 탭 (162 / 264)
*/
const EMPTY_STATE_MIN_HEIGHT = {
  page: 'min-h-[calc(100dvh-54px)] desktop:min-h-[calc(100dvh-88px)]',
  tab: 'min-h-[calc(100dvh-108px)] desktop:min-h-[calc(100dvh-168px)]',
  title: 'min-h-[calc(100dvh-108px)] desktop:min-h-[calc(100dvh-184px)]',
  titleAndTab: 'min-h-[calc(100dvh-162px)] desktop:min-h-[calc(100dvh-264px)]',
} as const;

type EmptyStateFit = keyof typeof EMPTY_STATE_MIN_HEIGHT;

interface EmptyStateBaseProps {
  message: string;
  variant?: EmptyStateVariant;
  /** 위에 붙어 있는 크롬. 없으면 고정 헤더만 뺀다 */
  fit?: EmptyStateFit;
  /** 404·error처럼 이 화면이 페이지의 main일 때만 */
  as?: 'div' | 'main';
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
  fit = 'page',
  as: Root = 'div',
  buttonLabel,
  href,
  onClick,
  isFullViewport = false,
}: EmptyStateProps) {
  const buttonSize = useBreakpointValue('sm', 'lg', 'lg');
  const illustration = EMPTY_STATE_IMAGES[variant];
  const actionButton = href ? (
    <Button href={href} size={buttonSize}>
      {buttonLabel}
    </Button>
  ) : onClick ? (
    <Button onClick={onClick} size={buttonSize}>
      {buttonLabel}
    </Button>
  ) : null;

  return (
    <Root
      className={cn(
        'flex items-center justify-center px-[24px]',
        isFullViewport ? 'min-h-dvh' : EMPTY_STATE_MIN_HEIGHT[fit],
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
        {buttonLabel && actionButton ? (
          <div
            className={cn(
              'flex items-center justify-center w-full',
              'tablet:min-w-[140px] tablet:w-fit',
            )}
          >
            {actionButton}
          </div>
        ) : null}
      </div>
    </Root>
  );
}
