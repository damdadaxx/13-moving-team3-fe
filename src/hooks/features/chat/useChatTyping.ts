'use client';

import { useEffect, useRef, useState } from 'react';

import { chatSocket } from '@/lib/socket/client';

// 연속 입력 중에도 이 간격에 한 번만 'typing'을 보낸다
const EMIT_THROTTLE_MS = 2_000;
// 마지막 신호 이후 이만큼 조용하면 "입력 중" 표시를 끈다 (별도 stop 이벤트 없이 TTL로 처리)
const OTHER_TYPING_TIMEOUT_MS = 3_000;

interface TypingPayload {
  estimateId: string;
}

/** 입력 중임을 상대에게 알린다. 텍스트가 바뀔 때마다 호출하면 알아서 쓰로틀된다 */
export function useEmitTyping(estimateId: string) {
  const lastSentAtRef = useRef(0);

  return () => {
    const now = Date.now();
    if (now - lastSentAtRef.current < EMIT_THROTTLE_MS) return;
    lastSentAtRef.current = now;
    chatSocket.emit('typing', estimateId);
  };
}

/** 상대가 타이핑 중인지. 신호가 끊기면 OTHER_TYPING_TIMEOUT_MS 뒤에 자동으로 꺼진다 */
export function useOtherTyping(estimateId: string, enabled: boolean): boolean {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleTyping = (payload: TypingPayload) => {
      if (payload.estimateId !== estimateId) return;
      setIsTyping(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsTyping(false), OTHER_TYPING_TIMEOUT_MS);
    };

    chatSocket.on('typing', handleTyping);

    return () => {
      chatSocket.off('typing', handleTyping);
      clearTimeout(timer);
      setIsTyping(false);
    };
  }, [estimateId, enabled]);

  return isTyping;
}
