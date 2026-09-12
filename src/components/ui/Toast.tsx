// 토스트 알림 컴포넌트 (Figma: toast-popup)
'use client';

import { useEffect, useState, type AnimationEvent } from 'react';

import { cn } from '@/utils/cn';

const TOAST_DURATION_MS = 3000;

interface ToastProps {
  message: string;
  className?: string;
  onClose?: () => void;
}

type ToastPhase = 'in' | 'out' | 'done';

/*
@ Toast
- 마운트 시 위에서 slide-down, 3초 후 slide-up 하고 닫힘
- 위치는 ToastProvider가 document.body 포탈에서 스택으로 잡는다
*/

export default function Toast({ message, className, onClose }: ToastProps) {
  const [phase, setPhase] = useState<ToastPhase>('in');

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('out'), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (phase === 'done') return null;

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== 'toast-slide-up') return;

    setPhase('done');
    onClose?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        'mx-auto flex w-full max-w-[640px] items-center bg-orange-200 text-orange-400',
        'rounded-[12px] px-[24px] py-[14px] text-lg-semibold',
        'shadow-[-2px_-2px_10px_0px_rgba(46,46,46,0.04),2px_2px_10px_0px_rgba(46,46,46,0.04)]',
        'desktop:max-w-[1200px] desktop:rounded-[16px] desktop:px-[32px] desktop:py-[20px] desktop:text-2lg-semibold',
        phase === 'out' ? 'animate-toast-slide-up' : 'animate-toast-slide-down',
        className,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      {message}
    </div>
  );
}
