// 목록이 비었거나 불러오지 못했을 때 보여주는 안내
// 비버 일러스트 + 한 줄 문구. CTA 버튼이 있는 EmptyState(404·error용)와는 다른 패턴이다.
/*
@ 사용처
- 받았던 견적 목록 (빈 목록 / 조회 실패)
- 받은 요청 목록(mover/requests)도 같은 모양을 페이지에 직접 그리고 있다.
  그쪽을 건드릴 일이 생기면 이 컴포넌트로 합치면 된다.
*/
import Image from 'next/image';

import ImgEmptyBeaver from '@/assets/images/img_empty_beaver.png';

import { cn } from '@/utils/cn';

interface EmptyListNoticeProps {
  message: string;
  className?: string;
}

export default function EmptyListNotice({
  message,
  className,
}: EmptyListNoticeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-[24px] px-[24px] py-[80px]',
        'desktop:gap-[32px] desktop:pt-[180px]',
        className,
      )}
    >
      <Image
        src={ImgEmptyBeaver}
        alt=""
        width={240}
        height={240}
        aria-hidden
        priority
        className="size-[240px] object-contain"
      />
      <p className="text-lg-regular text-gray-400 desktop:text-xl-regular">
        {message}
      </p>
    </div>
  );
}
