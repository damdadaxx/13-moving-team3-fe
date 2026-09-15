import { cn } from '@/utils/cn';

export type DisplayTagSize = 'sm' | 'md';

interface DisplayTagBaseProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size: DisplayTagSize;
  colorClassName: string;
  smallGapClassName: string;
  widthClassName: string;
}

/*
@ 표시 전용 태그 공통 레이아웃
- ServiceTypeTag와 DesignatedEstimateTag가 공유하는 아이콘, 라벨과 크기 구조를 담당합니다.
- 태그의 의미, 색상과 너비는 각 파생 컴포넌트가 결정합니다.
- size는 sm 또는 md의 고정 크기만 제공하며 반응형 조합은 실제 사용처의 className으로 적용합니다.
- 아이콘과 label의 의미가 같으므로 아이콘은 스크린 리더에서 숨깁니다.
*/

export default function DisplayTagBase({
  label,
  icon: Icon,
  size,
  colorClassName,
  smallGapClassName,
  widthClassName,
  className,
  ...props
}: DisplayTagBaseProps) {
  const sizeClassNames: Record<DisplayTagSize, string> = {
    sm: cn(
      'h-[26px] rounded-[4px] py-[2px] pr-[7px] pl-[4px]',
      'text-sm-semibold',
      smallGapClassName,
    ),
    md: cn(
      'h-[32px] gap-[4px] rounded-[6px] py-[4px] pr-[7px] pl-[5px]',
      'text-md-semibold',
    ),
  };

  return (
    <span
      {...props}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap',
        'drop-shadow-[4px_4px_4px_rgba(217,217,217,0.1)]',
        colorClassName,
        sizeClassNames[size],
        widthClassName,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        focusable="false"
        className="size-[20px] shrink-0"
      />
      <span>{label}</span>
    </span>
  );
}
