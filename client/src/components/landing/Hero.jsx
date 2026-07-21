import { Link } from "react-router-dom";
import { ArrowRight, MousePointer } from "lucide-react";
import Container from "../common/Container";
import { useAuth } from "../../hooks/useAuth";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const ctaTarget = isAuthenticated ? "/dashboard" : "/signup";
  const ctaLabel = isAuthenticated ? "Open Dashboard" : "Start Building Free";

  return (
    <section className="py-8 md:py-12">
      <Container>
        {/* Main Hero Card Frame matching reference image */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-hero-card p-8 sm:p-12 md:p-16 shadow-2xl border border-white/20">
          {/* Subtle Ambient Glow inside Card */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 -mb-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column Text Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                Build Web Apps <br />
                at Speed of AI.
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-cyan-100/90 leading-relaxed font-medium">
                No Code. Just Flow. Launch Your App in Minutes with Intelligent Automation & Full-Stack MERN Code Generation.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link to={ctaTarget} className="nav-glow-btn">
                  <span className="nav-glow-btn-inner bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 px-7 py-3 text-sm text-white">
                    {ctaLabel} <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                  </span>
                </Link>
                <a href="#how-it-works" className="nav-glow-btn">
                  <span className="nav-glow-btn-inner bg-white/10 px-6 py-3 text-sm text-white">
                    Watch Demo
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column Glassmorphic Component Wireframe Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl">
                {/* Header Window Dots */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-200/70">App Canvas</span>
                </div>

                {/* Wireframe Mockup Nodes */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-xl border border-cyan-400/40 bg-cyan-500/20 p-2 flex flex-col justify-between">
                      <div className="h-2 w-8 bg-cyan-300/60 rounded" />
                      <div className="h-4 w-4 rounded-full bg-cyan-400/80" />
                    </div>
                    <div className="col-span-2 h-16 rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/20 p-2.5">
                      <div className="h-2 w-16 bg-fuchsia-300/60 rounded mb-2" />
                      <div className="h-2 w-24 bg-white/40 rounded" />
                    </div>
                  </div>

                  <div className="h-24 rounded-xl border border-indigo-400/40 bg-indigo-500/20 p-3 relative overflow-hidden">
                    <div className="h-2.5 w-20 bg-indigo-300/70 rounded mb-3" />
                    <div className="h-2 w-32 bg-white/30 rounded" />
                    {/* Simulated Cursor Pointer */}
                    <div className="absolute right-4 bottom-4 flex items-center gap-1 text-cyan-300 text-[10px]">
                      <MousePointer className="h-4 w-4 fill-cyan-400 stroke-cyan-200 animate-bounce" />
                    </div>
                  </div>
                </div>

                {/* Caption Badge */}
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-medium text-cyan-200/80 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                    AI-generated app preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
