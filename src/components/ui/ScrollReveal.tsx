// 스크롤로 뷰포트에 들어오면 fadein + slideup되는 공용 래퍼
// 모바일 홈 인트로가 재생 중일 때만(useIntroGate) 끝나기 전에는 재생하지 않고 숨겨둔다
'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  slide?: boolean;
  /** 모바일 인트로가 재생될 때만 delay를 적용한다 */
  onlyWithIntro?: boolean;
  /** 모바일 인트로가 재생될 때만 아래에서 올라온다. 아니면 제자리에서 나타난다 */
  slideOnlyWithIntro?: boolean;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0.3,
  slide = true,
  onlyWithIntro = false,
  slideOnlyWithIntro = false,
}: ScrollRevealProps) {
  const { ready, isIntroActive } = useIntroGate();
  const [withIntro, setWithIntro] = useState(false);
  if ((onlyWithIntro || slideOnlyWithIntro) && isIntroActive && !withIntro) {
    setWithIntro(true);
  }
  const resolvedDelay = onlyWithIntro && !withIntro ? 0 : delay;
  const resolvedSlide = slideOnlyWithIntro ? withIntro : slide;

  if (!ready) {
    return (
      <div className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      // slide=false일 땐 y를 아예 안 다뤄야 함 - translateY(0px)이어도 transform이 설정되면
      // fixed 자손의 containing block이 바뀌어 fixed 포지셔닝이 깨진다
      initial={resolvedSlide ? { opacity: 0, y: 50 } : { opacity: 0 }}
      whileInView={resolvedSlide ? { opacity: 1, y: 0 } : { opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: resolvedDelay }}
    >
      {children}
    </motion.div>
  );
}
