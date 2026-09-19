import IcLikeBlack from '@/assets/icons/ic_like_black.svg';

import { cn } from '@/utils/cn';

import ButtonElement from '@/components/ui/Button/ButtonElement';

export default function ButtonLikeMover({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <ButtonElement
      type="button"
      disabled={false}
      isLoading={false}
      onClick={onClick}
      aria-label="기사님 찜하기"
      className={cn(
        'h-[54px] gap-[10px] rounded-[16px] border border-line-200 bg-gray-50 p-[10px] hover:bg-background-100',
        className,
      )}
    >
      <IcLikeBlack aria-hidden className="h-[24px] w-[24px]" />
      <span className="text-2lg-semibold text-black-400">기사님 찜하기</span>
    </ButtonElement>
  );
}
