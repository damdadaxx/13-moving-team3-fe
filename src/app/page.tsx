'use client';

// 랜딩 페이지
import CompareEstimatesSection from '@/components/public/landing/CompareEstimatesSection';
import EstimateRequestSection from '@/components/public/landing/EstimateRequestSection';
import Footer from '@/components/public/landing/Footer';
import Hero from '@/components/public/landing/Hero';
import MoveTypeSection from '@/components/public/landing/MoveTypeSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <MoveTypeSection />
      <EstimateRequestSection />
      <CompareEstimatesSection />
      <Footer />
    </main>
  );
}
