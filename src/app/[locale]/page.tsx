'use client';

// 랜딩 페이지
import CompareEstimatesSection from '@/components/features/public/landing/CompareEstimatesSection';
import DemoVideoPopup from '@/components/features/public/landing/DemoVideoPopup';
import EstimateRequestSection from '@/components/features/public/landing/EstimateRequestSection';
import Footer from '@/components/features/public/landing/Footer';
import Hero from '@/components/features/public/landing/Hero';
import IntroOverlay from '@/components/features/public/landing/IntroOverlay';
import MoveTypeSection from '@/components/features/public/landing/MoveTypeSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  return (
    <>
      {/* 모바일 인트로 섹션 */}
      <IntroOverlay />

      {/* 히어로 섹션 */}
      <Hero />

      {/* 이사 유형 섹션 */}
      <ScrollReveal delay={0.3} onlyWithIntro>
        <MoveTypeSection />
      </ScrollReveal>

      {/* 견적 요청 섹션 */}
      <ScrollReveal>
        <EstimateRequestSection />
      </ScrollReveal>

      {/* 견적 비교 섹션 */}
      <ScrollReveal>
        <CompareEstimatesSection />
      </ScrollReveal>

      {/* 푸터 섹션 */}
      <Footer />

      {/* 데모 영상 팝업 */}
      <DemoVideoPopup />
    </>
  );
}
