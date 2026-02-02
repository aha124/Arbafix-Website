import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import EbayTrustBadge from "@/components/EbayTrustBadge";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <EbayTrustBadge />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
