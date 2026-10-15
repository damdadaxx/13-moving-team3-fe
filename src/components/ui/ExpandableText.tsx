'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

/*
@ 두 줄까지만 보여주고 넘치면 "더보기"로 펼치는 텍스트
- 2줄을 넘을 때만 "더보기" 버튼이 생깁니다. 짧은 글에는 버튼이 없습니다.
- "더보기"를 누르면 전체 글이 펼쳐지고 버튼은 사라집니다.
- 넘침 여부는 화면 너비가 바뀌어도 다시 계산합니다 (ResizeObserver).
- 긴 단어·반복 문자로 가로가 넘치지 않게 break-words를 적용합니다.

@ 사용 예시
<ExpandableText className="text-lg-semibold text-black-300">
  {estimate.comment}
</ExpandableText>
*/

interface ExpandableTextProps {
  children: string;
  className?: string;
}

export default function ExpandableText({
  children,
  className,
}: ExpandableTextProps) {
  const t = useTranslations('Common');
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || isExpanded) return;

    const check = () =>
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);

    check();
    const observer = new ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, isExpanded]);

  return (
    <div className="flex flex-col items-start gap-[4px]">
      <p
        ref={textRef}
        className={cn(
          'w-full break-words whitespace-pre-line',
          !isExpanded && 'line-clamp-2',
          className,
        )}
      >
        {children}
      </p>

      {!isExpanded && isOverflowing && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="cursor-pointer text-sm-medium text-gray-400 underline tablet:text-md-medium"
        >
          {t('showMore')}
        </button>
      )}
    </div>
  );
}
