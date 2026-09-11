// 공용 버튼 스타일 (Figma: Button/solid/CTA, Button/outlined/CTA)
// <button>인 Button과 <a>인 ButtonLink가 공유하는 건 이 파일 하나뿐이다.
import { cva, type VariantProps } from 'class-variance-authority';

/** 두 컴포넌트가 공유하는 기본 클래스
 * - 너비는 Figma가 sm 327px / md 640px로 고정돼 있지만 CTA는 부모 폭을 꽉 채우는
 *   용도라 w-full로 두고, 필요하면 className으로 덮어쓴다
 */
export const BUTTON_BASE_CLASS =
  'flex w-full cursor-pointer items-center justify-center transition aria-disabled:cursor-not-allowed';

/** buttonVariants
 * - Figma의 state(default/hover/disabled)는 prop이 아니라 CSS 상태로 옮김
 * - 상태 스타일은 :disabled/:enabled가 아니라 aria-disabled를 본다.
 *   ButtonLink는 <a>로 렌더되는데 <a>는 :disabled/:enabled에 아예 매칭되지
 *   않아서, 두 컴포넌트가 같은 클래스를 쓰려면 기준을 aria로 맞춰야 한다
 * - padding은 variant마다 다르다 (solid 16px / outlined 좌우 24px·상하 16px)
 * - outlined의 disabled 색(#C4C4C4 테두리, #808080 텍스트)은 globals.css에 대응
 *   토큰이 없어서 임의값으로 둔다. 토큰이 추가되면 그걸로 교체할 것
 */
export const buttonVariants = cva(BUTTON_BASE_CLASS, {
  variants: {
    variant: {
      solid:
        'bg-orange-400 p-4 text-gray-50 not-aria-disabled:hover:bg-orange-500 aria-disabled:bg-gray-300',
      outlined:
        'border border-orange-400 px-6 py-4 text-orange-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] not-aria-disabled:hover:bg-orange-100 not-aria-disabled:hover:shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)] aria-disabled:border-[#c4c4c4] aria-disabled:text-[#808080]',
    },
    size: {
      sm: 'h-[54px] gap-1 rounded-[12px] text-lg-semibold',
      md: 'h-[60px] gap-2 rounded-[16px] text-2lg-semibold',
      lg: 'h-[64px] gap-2 rounded-[16px] text-2lg-semibold',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
