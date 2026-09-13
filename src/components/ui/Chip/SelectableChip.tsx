import { cn } from '@/utils/cn';

export type SelectableChipSize = 'sm' | 'md' | 'responsive';

export interface SelectableChipProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: React.ReactNode;
  size?: SelectableChipSize;
  isSelected?: boolean;
}

/*
 * 지역/이용 서비스 선택 버튼에서 공통으로 사용하는 Chip 컴포넌트입니다.
 *
 * - size="responsive" (기본값): 모바일에서는 sm(36px), tablet 이상에서는
 *   md(46px)로 화면 크기에 따라 자동 전환됩니다.
 * - size="sm" | "md": 화면 크기와 무관하게 해당 크기로 고정합니다.
 *   (반응형이 아닌, 항상 같은 크기로 보여야 하는 자리에서만 사용)
 *
 * 선택 여부(isSelected)는 부모가 상태로 들고 있다가 내려주고,
 * 클릭 시 상태 변경은 onClick 핸들러에서 부모가 처리합니다.
 */
export default function SelectableChip({
  children,
  size = 'responsive',
  isSelected = false,
  className,
  type = 'button',
  ...props
}: SelectableChipProps) {
  // 사이즈별 높이/여백을 한 곳에 모아둔 테이블입니다.
  // 값이 바뀌거나 사이즈가 추가될 때 여기 한 곳만 수정하면 됩니다.
  const SIZE_CLASS: Record<SelectableChipSize, string> = {
    sm: 'h-[36px] px-[12px] py-[6px]',
    md: 'h-[46px] px-[20px] py-[10px]',
    responsive: cn(
      'h-[36px] px-[12px] py-[6px]', // 모바일 기본값 (= sm과 동일)
      'tablet:h-[46px] tablet:px-[20px] tablet:py-[10px]', // tablet 이상
    ),
  };

  // 사이즈별 글자 스타일 테이블입니다.
  // sm 크기에서는 선택 여부와 무관하게 항상 medium 굵기를 사용합니다.
  const TYPOGRAPHY_CLASS: Record<SelectableChipSize, string> = {
    sm: 'text-md-medium',
    md: isSelected ? 'text-2lg-medium' : 'text-2lg-regular',
    responsive: cn(
      'text-md-medium', // 모바일 기본값
      isSelected ? 'tablet:text-2lg-medium' : 'tablet:text-2lg-regular',
    ),
  };

  return (
    <button
      {...props}
      type={type}
      aria-pressed={isSelected}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap',
        'rounded-[100px] border border-solid',
        SIZE_CLASS[size],
        TYPOGRAPHY_CLASS[size],
        isSelected
          ? 'border-orange-400 bg-orange-100 text-orange-400'
          : 'border-gray-100 bg-background-100 text-black-400',
        className,
      )}
    >
      {children}
    </button>
  );
}
