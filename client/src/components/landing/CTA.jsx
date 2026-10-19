import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="reveal relative mb-24 mt-6 flex flex-col items-center gap-6 overflow-hidden rounded-[28px] bg-cta px-6 py-14 text-center text-cta-fg sm:px-12 sm:py-[72px]">
      <div
        aria-hidden="true"
        className="orb orb-drift-2 left-[10%] -top-40 h-[360px] w-[360px]"
        style={{ background: "var(--cta-orb)" }}
      />
      <h2 className="relative max-w-[720px] font-display text-4xl font-normal leading-[1.02] sm:text-[56px]">
        Ready to launch your next app?
      </h2>
      <p className="relative max-w-[560px] text-base leading-relaxed text-cta-muted sm:text-[17px]">
        Create a free account and turn your first idea into a working React site today.
      </p>
      <Link to="/signup" className="btn btn-primary shine relative h-[52px] gap-2.5 px-7 text-[15px]">
        Get started free
        <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
};

export default CTA;
