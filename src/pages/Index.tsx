import Navbar from '@/components/landing/Navbar';
import Ticker from '@/components/landing/Ticker';
import HeroSection from '@/components/landing/HeroSection';
import MetricsBar from '@/components/landing/MetricsBar';
import FundsSection from '@/components/landing/FundsSection';
import StakingSection from '@/components/landing/StakingSection';
import TiersSection from '@/components/landing/TiersSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PaymentSection from '@/components/landing/PaymentSection';
import BriefingSection from '@/components/landing/BriefingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import BottomBar from '@/components/landing/BottomBar';

const Index = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-[38px]">
      <Navbar onScrollTo={scrollTo} />
      <Ticker />
      <HeroSection onScrollTo={scrollTo} />
      <MetricsBar />
      <FundsSection />
      <StakingSection />
      <TiersSection />
      <TestimonialsSection />
      <PaymentSection />
      <BriefingSection />
      <CTASection />
      <Footer onScrollTo={scrollTo} />
      <BottomBar />
    </div>
  );
};

export default Index;
