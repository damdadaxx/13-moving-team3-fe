// 공용 카드 틀 (Card-list 계열이 공통으로 쓰는 프레임)
// Figma: Card-list/받은 요청 등 여러 "Card-list/*" 컴포넌트가 이 틀을 공유한다.
// 내용(칩, 제목, 본문, 버튼 등)은 페이지·도메인마다 달라 children으로 받는다.
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-[24px] rounded-[20px] border-[0.5px] border-line-100 bg-gray-50 px-[20px] py-[24px]',
        'shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.2),2px_2px_10px_0_rgba(220,220,220,0.2)]',
        'tablet:px-[40px] tablet:py-[32px]',
        'desktop:gap-[32px] desktop:px-[40px] desktop:py-[32px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
