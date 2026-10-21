// 기사님 찾기 — AI 검색 켜기/끄기 버튼 (오늘 남은 횟수 표시)
'use client';

import type { AiUsage } from '@/types/ai';
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

interface MoverAiSearchToggleProps {
  isOn: boolean;
  /** 로그인 사용자의 오늘 남은 AI 검색 횟수. 비로그인·조회 전이면 undefined */
  usage?: AiUsage;
  onToggle: () => void;
  className?: string;
}

/*
@ AI 검색 토글
- 높이는 옆의 검색바와 맞춘다 (모바일 52px / 데스크톱 64px)
- 오늘 횟수를 다 쓰면 켤 수 없다. 이미 켜져 있으면 끌 수는 있다
- 비로그인 클릭은 부모가 로그인 모달로 처리한다 (여기서는 막지 않는다)
*/
export default function MoverAiSearchToggle({
  isOn,
  usage,
  onToggle,
  className,
}: MoverAiSearchToggleProps) {
  const t = useTranslations('MoverFind');
  const isExhausted = usage?.remaining === 0;

  return (
    <button
      type="button"
      aria-pressed={isOn}
      aria-label={t('aiToggleLabel')}
      disabled={!isOn && isExhausted}
      title={isExhausted ? t('aiExhausted') : undefined}
      onClick={onToggle}
      className={cn(
        'flex h-[52px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[16px] border px-3',
        'desktop:h-[64px] desktop:px-4',
        isOn
          ? 'border-orange-400 bg-orange-400 text-gray-50'
          : 'border-orange-400 bg-transparent text-orange-400 hover:bg-orange-100',
        'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent',
        className,
      )}
    >
      <span className="text-sm-medium whitespace-nowrap desktop:text-md-medium">
        {t('aiToggle')}
      </span>
      {usage ? (
        <span className="text-xs-regular whitespace-nowrap">
          {t('aiRemaining', {
            remaining: usage.remaining,
            limit: usage.limit,
          })}
        </span>
      ) : null}
    </button>
  );
}
