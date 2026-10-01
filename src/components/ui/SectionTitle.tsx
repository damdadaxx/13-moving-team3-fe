// 섹션 타이틀 컴포넌트
import { cn } from '@/utils/cn';

export default function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'mb-[8px] text-lg-semibold text-black-400',
        'tablet:mb-[16px] tablet:text-xl-semibold',
        className,
      )}
    >
      {children}
    </h2>
  );
}
