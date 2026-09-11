// 공통 둥근 사각 아이콘 버튼 (Figma: Button > etc)
import { cva, type VariantProps } from 'class-variance-authority';

import IcClip from '@/assets/icons/ic_clip.svg';
import IcFacebook from '@/assets/icons/ic_facebook.svg';
import IcKakao from '@/assets/icons/ic_kakao.svg';
import IcLike from '@/assets/icons/ic_like.svg';

import { cn } from '@/utils/cn';

import ButtonElement, { type ButtonElementProps } from './ButtonElement';

const buttonRoundedSquareVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center transition',
    'size-[40px] rounded-[8px]',
    'tablet:size-[54px] tablet:rounded-[16px]',
    'desktop:size-[64px]',
  ],
  {
    variants: {
      variant: {
        like: 'border border-line-200 bg-gray-50',
        clip: 'border border-line-200 bg-gray-50',
        kakao: 'bg-[#FAE100]',
        facebook: 'bg-orange-400',
      },
    },
    defaultVariants: {
      variant: 'like',
    },
  },
);

const ICON_SIZE_CLASS = [
  'flex shrink-0 items-center justify-center overflow-hidden',
  '[&>svg]:block [&>svg]:size-full',
  'size-[24px] desktop:size-[36px]',
].join(' ');

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

type ButtonRoundedSquareOwnProps = VariantProps<
  typeof buttonRoundedSquareVariants
> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

type ButtonRoundedSquareProps = ButtonRoundedSquareOwnProps &
  Omit<ButtonElementProps, 'children'>;

export default function ButtonRoundedSquare({
  variant = 'like',
  className,
  disabled,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: ButtonRoundedSquareProps) {
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
      onClick={onClick}
      aria-label={ariaLabel ?? variantAriaLabel}
      className={cn(
        buttonRoundedSquareVariants({ variant: resolvedVariant }),
        className,
      )}
    >
      <span aria-hidden="true" className={ICON_SIZE_CLASS}>
        <Icon className={cn('size-full', iconClassName)} />
      </span>
    </ButtonElement>
  );
}
