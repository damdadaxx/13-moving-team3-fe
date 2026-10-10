'use client';

// 랜딩 페이지
import CompareEstimatesSection from '@/components/features/public/landing/CompareEstimatesSection';
import EstimateRequestSection from '@/components/features/public/landing/EstimateRequestSection';
import Footer from '@/components/features/public/landing/Footer';
import Hero from '@/components/features/public/landing/Hero';
import IntroOverlay from '@/components/features/public/landing/IntroOverlay';
import MoveTypeSection from '@/components/features/public/landing/MoveTypeSection';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  return (
    <main>
      <IntroOverlay />
      <ScrollReveal delay={0.15}>
        <Hero />
      </ScrollReveal>
      <ScrollReveal delay={0.3}>
        <MoveTypeSection />
      </ScrollReveal>
      <ScrollReveal>
        <EstimateRequestSection />
      </ScrollReveal>
      <ScrollReveal>
        <CompareEstimatesSection />
      </ScrollReveal>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </main>
  );
}
