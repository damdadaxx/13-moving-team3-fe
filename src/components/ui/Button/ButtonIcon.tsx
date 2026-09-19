// 공통 아이콘 버튼 (Figma: Button > etc)
import { cva, type VariantProps } from 'class-variance-authority';

import IcClip from '@/assets/icons/ic_clip.svg';
import IcFacebook from '@/assets/icons/ic_facebook.svg';
import IcKakao from '@/assets/icons/ic_kakao.svg';
import IcLike from '@/assets/icons/ic_like.svg';

import { cn } from '@/utils/cn';

import ButtonElement, { type ButtonElementProps } from './ButtonElement';

/*
@ ButtonIcon CVA
- size는 sm(40px) / md(54px) / lg(64px) 고정과 responsive를 제공합니다.
- Figma Button > etc는 xs=40 / sm=54 / md=64입니다. 프로젝트 size 이름에 맞춰
  sm / md / lg로 매핑합니다.
- 기본값 responsive는 모바일 40px → 태블릿 54px → 데스크톱 64px입니다.
  아이콘은 24px이고 데스크톱만 36px입니다.
*/

const buttonIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center transition',
  {
    variants: {
      variant: {
        like: 'border border-line-200 bg-gray-50',
        clip: 'border border-line-200 bg-gray-50',
        kakao: 'bg-[#FAE100]',
        facebook: 'bg-orange-400',
      },
      size: {
        sm: 'size-[40px] rounded-[8px]',
        md: 'size-[54px] rounded-[16px]',
        lg: 'size-[64px] rounded-[16px]',
        responsive: [
          'size-[40px] rounded-[8px]',
          'tablet:size-[40px]',
          'desktop:size-[64px] desktop:rounded-[16px]',
        ],
      },
    },
    defaultVariants: {
      variant: 'like',
      size: 'responsive',
    },
  },
);

const buttonIconGlyphVariants = cva(
  [
    'flex shrink-0 items-center justify-center overflow-hidden',
    '[&>svg]:block [&>svg]:size-full',
  ],
  {
    variants: {
      size: {
        sm: 'size-[24px]',
        md: 'size-[24px]',
        lg: 'size-[36px]',
        responsive: 'size-[24px] desktop:size-[36px]',
      },
    },
    defaultVariants: {
      size: 'responsive',
    },
  },
);

const VARIANT_CONFIG = {
  like: {
    Icon: IcLike,
    iconClassName: 'text-black-500',
    ariaLabel: '찜하기',
  },
  clip: {
    Icon: IcClip,
    iconClassName: 'text-gray-300',
    ariaLabel: '링크 복사',
  },
  kakao: {
    Icon: IcKakao,
    iconClassName: undefined,
    ariaLabel: '카카오 공유',
  },
  facebook: {
    Icon: IcFacebook,
    iconClassName: undefined,
    ariaLabel: '페이스북 공유',
  },
} as const;

type ButtonIconSize = NonNullable<
  VariantProps<typeof buttonIconVariants>['size']
>;

type ButtonIconOwnProps = VariantProps<typeof buttonIconVariants> & {
  size?: ButtonIconSize;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

type ButtonIconProps = ButtonIconOwnProps &
  Omit<ButtonElementProps, 'children'>;

export default function ButtonIcon({
  variant = 'like',
  size = 'responsive',
  className,
  disabled,
  isLoading,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: ButtonIconProps) {
  const resolvedVariant = variant ?? 'like';
  const {
    Icon,
    iconClassName,
    ariaLabel: variantAriaLabel,
  } = VARIANT_CONFIG[resolvedVariant];

  return (
    <ButtonElement
      {...(props as ButtonElementProps)}
      type={type}
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
      aria-label={ariaLabel ?? variantAriaLabel}
      className={cn(
        buttonIconVariants({ variant: resolvedVariant, size }),
        className,
      )}
    >
      <span aria-hidden="true" className={buttonIconGlyphVariants({ size })}>
        <Icon className={cn('size-full', iconClassName)} />
      </span>
    </ButtonElement>
  );
}
