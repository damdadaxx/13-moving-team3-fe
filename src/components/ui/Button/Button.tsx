// 공용 CTA 버튼 (Figma: Button/solid/CTA, Button/outlined/CTA)
// 태그 분기(button / Link / 비활성 a)와 스피너는 ButtonElement가 담당하고,
// 이 컴포넌트는 CTA variant 스타일과 아이콘 슬롯만 얹는다.
import { cn } from '@/utils/cn';

import ButtonElement, { type ButtonElementProps } from './ButtonElement';
import { buttonVariants, type ButtonVariantProps } from './ButtonStyles';

/* ButtonElementProps는 href 유무로 갈린 유니온이라 교차 타입이 분배된다.
   덕분에 href를 넘기면 Link props, 안 넘기면 button props가 그대로 살아남는다 */
type ButtonProps = ButtonElementProps &
  ButtonVariantProps & {
    /** 텍스트 오른쪽에 붙는 24x24 아이콘 (Figma의 solid-icon 변형) */
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
      /* variant 스타일은 aria-disabled를 보는데 ButtonElement는 네이티브
         <button>에 이걸 붙이지 않는다. 안 넘기면 비활성 버튼이 회색으로 바뀌지
         않고 hover도 계속 먹는다. 링크 분기에서는 ButtonElement가 자기 값으로
         덮어쓰므로 중복되지 않는다 */
      aria-disabled={isDisabled || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
      {/* 아이콘은 텍스트 옆 장식이라 보조기기에서는 숨긴다.
          isLoading이면 ButtonElement가 children 대신 스피너를 그리므로
          아이콘도 같이 사라진다 */}
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
