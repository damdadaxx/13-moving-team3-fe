// 스크롤로 뷰포트에 들어오면 fadein + slideup되는 공용 래퍼
// 홈 인트로가 끝나기 전에는(useIntroGate) 재생하지 않고 숨겨둔다
'use client';

import { motion } from 'framer-motion';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  slide?: boolean;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0.3,
  slide = true,
}: ScrollRevealProps) {
  const { ready } = useIntroGate();

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
      initial={slide ? { opacity: 0, y: 40 } : { opacity: 0 }}
      whileInView={slide ? { opacity: 1, y: 0 } : { opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
