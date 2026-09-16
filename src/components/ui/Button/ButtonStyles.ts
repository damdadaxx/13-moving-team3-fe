import { cva, type VariantProps } from 'class-variance-authority';

export const BUTTON_BASE_CLASS =
  'flex w-full cursor-pointer items-center justify-center transition aria-disabled:cursor-not-allowed disabled:cursor-not-allowed';

export const buttonVariants = cva(BUTTON_BASE_CLASS, {
  variants: {
    variant: {
      solid:
        'bg-orange-400 p-4 text-gray-50 not-aria-disabled:hover:bg-orange-500 aria-disabled:bg-gray-300',
      outlined:
        'border border-orange-400 px-6 py-4 text-orange-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] not-aria-disabled:hover:bg-orange-100 not-aria-disabled:hover:shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)] aria-disabled:border-gray-200 aria-disabled:text-gray-500',
    },
    size: {
      xs: 'h-[54px] gap-1 rounded-[12px] text-lg-semibold',
      sm: 'h-[54px] gap-1 rounded-[12px] text-lg-semibold tablet:text-2lg-semibold tablet:rounded-[16px] desktop:h-[60px]',
      md: 'h-[60px] gap-2 rounded-[12px] text-2lg-semibold desktop:h-[64px] desktop:rounded-[12px] desktop:text-2lg-semibold',
      lg: 'h-[64px] gap-2 rounded-[12px] text-2lg-semibold tablet:h-[64px] desktop:rounded-[12px] desktop:text-2lg-semibold',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
