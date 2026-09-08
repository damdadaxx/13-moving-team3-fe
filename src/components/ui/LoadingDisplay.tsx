'use client';

import { TailSpin } from 'react-loader-spinner';

import { cn } from '@/utils/cn';

export interface LoadingDisplayProps {
  /** 스피너 크기 (px), 기본 60 */
  size?: number;
  /** 추가 클래스 (wrapper에 적용) */
  className?: string;
  /** true면 min-h-[350px], false면 인라인 */
  fullHeight?: boolean;
}

/**
 * 전체 화면 로딩 스피너
 * - react-loader-spinner의 TailSpin 사용
 * - 스피너 크기, 색상, 추가 클래스, 전체 높이 옵션 제공
 */
export default function LoadingDisplay({
  size = 60,
  className = '',
  fullHeight = true,
}: LoadingDisplayProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center text-gray-500',
        fullHeight ? 'min-h-[350px] w-full' : 'h-fit w-fit',
        className,
      )}
    >
      <TailSpin
        visible={true}
        height={size}
        width={size}
        color="currentColor"
        ariaLabel="tail-spin-loading"
        radius={1}
      />
    </div>
  );
}
