// 헤더 전용 페이드인 래퍼
// Header는 fixed라 항상 뷰포트 안에 있어서, 스크롤 교차 여부로 트리거하는 ScrollReveal(whileInView)을
// 쓰면 푸터까지 스크롤된 채로 새로고침했을 때 교차 판정이 꼬여 안 뜨는 경우가 생긴다.
// 그래서 스크롤과 무관하게 ready 값만 보고 켜지는 별도 래퍼를 쓴다.
// 페이드인 자체는 홈(랜딩) 경로에만 적용한다 - 다른 페이지는 인트로가 없어서
// 매번 헤더가 깜빡이듯 페이드인하는 게 더 어색하다.
'use client';

import { motion } from 'framer-motion';

import { useIntroGate } from '@/lib/providers/IntroGateProvider';

export default function HeaderRevealWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, isHome } = useIntroGate();

  if (!isHome) return children;

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
