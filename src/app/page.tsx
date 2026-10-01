'use client';

// 랜딩 페이지
import CompareEstimatesSection from '@/components/features/public/landing/CompareEstimatesSection';
import EstimateRequestSection from '@/components/features/public/landing/EstimateRequestSection';
import Footer from '@/components/features/public/landing/Footer';
import Hero from '@/components/features/public/landing/Hero';
import MoveTypeSection from '@/components/features/public/landing/MoveTypeSection';

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
