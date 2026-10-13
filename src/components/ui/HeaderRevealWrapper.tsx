// 헤더 전용 페이드인 래퍼
// Header는 fixed라 항상 뷰포트 안에 있어서, 스크롤 교차 여부로 트리거하는 ScrollReveal(whileInView)을
// 쓰면 푸터까지 스크롤된 채로 새로고침했을 때 교차 판정이 꼬여 안 뜨는 경우가 생긴다.
// 그래서 스크롤과 무관하게 ready 값만 보고 켜지는 별도 래퍼를 쓴다.
// 페이드인 자체는 모바일 홈 인트로가 실제로 재생될 때만 적용한다.
// PC·태블릿·이미 본 세션은 인트로가 없으므로 헤더를 그대로 보여 준다.
'use client';

import { motion } from 'framer-motion';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

export default function HeaderRevealWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, isIntroActive } = useIntroGate();

  if (!isIntroActive) return children;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
