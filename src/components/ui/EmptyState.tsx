'use client';

import Image from 'next/image';

import ImgEmpty from '@/assets/images/img_empty.png';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

interface EmptyStateBaseProps {
  message: string;
  buttonLabel: string;
  /** true면 헤더 없는 전체 화면 높이 (global-error) */
  isFullViewport?: boolean;
}

type EmptyStateProps = EmptyStateBaseProps &
  ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

/*
@ EmptyState
- Figma img/Component/empty (sm/lg) 패턴
- 404·error·global-error에서 문구·CTA만 바꿔 사용
*/
export default function EmptyState({
  message,
  buttonLabel,
  href,
  onClick,
  isFullViewport = false,
}: EmptyStateProps) {
  const buttonSize = useBreakpointValue('sm', 'lg', 'lg');

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
        {/*
        @ empty 캐릭터
        - 바깥 240×196, 안쪽 260.633px + opacity-50
        */}
        <div className="relative h-[196px] w-[240px] overflow-hidden">
          <div className="absolute top-[-16.29px] left-[-11.04px] size-[260.633px] opacity-50">
            <Image
              src={ImgEmpty}
              alt=""
              fill
              sizes="261px"
              priority
              className="object-cover"
            />
          </div>
        </div>
        <h1
          className={cn(
            'text-center text-lg-regular text-gray-400',
            'tablet:text-2xl-regular',
          )}
        >
          {message}
        </h1>
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
      </div>
    </main>
  );
}
