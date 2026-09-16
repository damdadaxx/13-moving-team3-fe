import { cn } from '@/utils/cn';

import ButtonElement, { type ButtonElementProps } from './ButtonElement';
import { buttonVariants, type ButtonVariantProps } from './ButtonStyles';

type ButtonProps = ButtonElementProps &
  ButtonVariantProps & {
    icon?: React.ReactNode;
  };

export default function Button({
  variant,
  size,
  icon,
  className,
  children,
  disabled,
  isLoading = false,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || isLoading;

  return (
    <ButtonElement
      {...props}
      disabled={disabled}
      isLoading={isLoading}
      aria-disabled={isDisabled || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}
    </ButtonElement>
  );
}
