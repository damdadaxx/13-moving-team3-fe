// 견적/요청 카드 계열 공통 틀 (Card-list/받은 요청 등)
// Figma: Card-list/받은 요청. 받은 요청·기사님 찾기 결과·확정 견적처럼 견적 관련
// 카드가 이 틀을 공유할 것으로 보여 분리했다.
// 찜한 기사님·리뷰 카드는 padding·gap·radius가 달라 이 컴포넌트 범위가 아니다 —
// 실제로 그 화면을 만들 때 수치가 다르면 별도 컴포넌트로 둔다.
// 내용(칩, 제목, 본문, 버튼 등)은 페이지·도메인마다 달라 children으로 받는다.
import { cn } from '@/utils/cn';

interface EstimateCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function EstimateCard({
  children,
  className,
}: EstimateCardProps) {
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
