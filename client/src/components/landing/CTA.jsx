import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Container from "../common/Container";

const CTA = () => {
  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-hero-card p-10 sm:p-14 text-center shadow-2xl border border-white/20">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-cyan-200 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" /> Start Building Today
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
            Ready to Launch Your Next App?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-cyan-100/90 leading-relaxed font-medium">
            Create your free account now and experience full-stack MERN generation with AI, live code previews, and instant export.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/signup" className="nav-glow-btn">
              <span className="nav-glow-btn-inner bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 py-3.5 px-9 text-sm text-white">
                Get Started Free <ArrowRight className="h-5 w-5 ml-1.5 inline" />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
