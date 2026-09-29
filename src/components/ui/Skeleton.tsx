import { cn } from '@/utils/cn';

/** SkeletonProps 타입 정의 */
export interface SkeletonProps {
  /** Skeleton 블록 개수 (기본 1) */
  count?: number;
  /** Skeleton의 width (예: '100%', '120px') */
  width?: string | number;
  /** Skeleton의 height (예: '1rem', '20px') */
  height?: string | number;
  /** 추가 className */
  className?: string;
  /** border-radius 커스텀 */
  borderRadius?: string | number;
  /** style 직접 지정 */
  style?: React.CSSProperties;
}

/**
 * Skeleton UI 컴포넌트
 * - count, width, height, className, borderRadius, style prop 제공
 */
export function Skeleton({
  count = 1,
  width = '100%',
  height = '1.25rem',
  className = '',
  borderRadius = 4,
  style,
}: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(className)}
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 ? 8 : 0,
            backgroundImage:
              'linear-gradient(90deg, var(--color-gray-200) 0%, var(--color-line-100) 40%, var(--color-gray-50) 50%, var(--color-line-100) 60%, var(--color-gray-200) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
            ...style,
          }}
          aria-busy="true"
        />
      ))}
    </>
  );
}
