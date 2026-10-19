import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg text-fg">
      <div
        aria-hidden="true"
        className="orb orb-drift-1 -left-20 -top-[120px] h-[420px] w-[420px]"
        style={{ background: "var(--orb-1)" }}
      />
      <div
        aria-hidden="true"
        className="orb orb-drift-2 -right-[120px] top-[260px] h-[480px] w-[480px]"
        style={{ background: "var(--orb-2)" }}
      />

      <div className="sticky top-0 z-30 h-[3px]" aria-hidden="true">
        <div className="scroll-progress h-[3px] bg-accent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Navbar />
        <Hero />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
