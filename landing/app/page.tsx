import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ValuePillars from '@/components/ValuePillars';
import HowItWorks from '@/components/HowItWorks';
import ProductPreview from '@/components/ProductPreview';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Security from '@/components/Security';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ValuePillars />
      <HowItWorks />
      <ProductPreview />
      <Testimonials />
      <Pricing />
      <Security />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
