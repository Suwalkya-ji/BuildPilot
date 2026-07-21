import Container from "../common/Container";
import { MessageSquarePlus, Bot, Eye, Rocket, MousePointer } from "lucide-react";

const steps = [
  {
    step: "1",
    icon: MessageSquarePlus,
    title: "Describe Your Idea",
    description: "Enter your website prompt in plain English specifying your design & MERN requirements.",
    illustration: (
      <div className="flex flex-col justify-between h-24 rounded-xl bg-[#090b10] border border-cyan-500/40 p-3 shadow-inner font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <MessageSquarePlus className="h-3.5 w-3.5" /> Prompt Input
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-28 bg-cyan-400/60 rounded" />
          <div className="h-2 w-20 bg-indigo-400/40 rounded" />
        </div>
      </div>
    ),
  },
  {
    step: "2",
    icon: Bot,
    title: "AI & Vector RAG",
    description: "Groq AI generates multi-file code while Qdrant vectors index your codebase context.",
    illustration: (
      <div className="flex flex-col justify-between h-24 rounded-xl bg-[#090b10] border border-indigo-500/40 p-3 shadow-inner font-mono text-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-purple-400 font-semibold">Groq + Qdrant</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-10 rounded bg-indigo-500/20 border border-indigo-400/30 p-1.5">
            <div className="h-1.5 w-8 bg-indigo-300/80 rounded mb-1" />
            <div className="h-1.5 w-12 bg-white/40 rounded" />
          </div>
          <div className="h-10 rounded bg-fuchsia-500/20 border border-fuchsia-400/30 p-1.5">
            <div className="h-1.5 w-10 bg-fuchsia-300/80 rounded mb-1" />
            <div className="h-1.5 w-8 bg-white/40 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "3",
    icon: Eye,
    title: "Edit & Live Preview",
    description: "Inspect code in Monaco Editor and test your live website instantly in Live Preview.",
    illustration: (
      <div className="flex flex-col justify-between h-24 rounded-xl bg-[#090b10] border border-fuchsia-500/40 p-3 shadow-inner relative overflow-hidden font-mono text-[10px]">
        <div className="flex items-center justify-between text-fuchsia-300 font-semibold">
          <span>Live Preview Sandbox</span>
          <MousePointer className="h-3.5 w-3.5 text-cyan-300 animate-bounce" />
        </div>
        <div className="space-y-1 text-[9px]">
          <p className="text-purple-400">export default App() &#123;</p>
          <p className="ml-2 text-cyan-300">return &lt;<span className="text-white">Preview</span> /&gt;</p>
          <p className="text-purple-400">&#125;</p>
        </div>
      </div>
    ),
  },
  {
    step: "4",
    icon: Rocket,
    title: "Iterate & Export",
    description: "Chat with AI to refine your features and export clean production-ready code.",
    illustration: (
      <div className="flex flex-col items-center justify-center h-24 rounded-xl bg-[#090b10] border border-purple-500/40 p-3 shadow-inner">
        <Rocket className="h-8 w-8 text-fuchsia-400 animate-pulse drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
        <span className="mt-1 text-[10px] font-mono text-cyan-300 font-bold">Ready to Export</span>
      </div>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 relative">
      <Container>
        {/* Left Aligned Section Title */}
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-10 text-left">
          Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div key={idx} className="card-conic-glow group">
              <div className="card-conic-glow-inner">
                {/* Number Badge at Top Left with Neon Glow */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/20 text-sm font-extrabold text-fuchsia-300 mb-5 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-transform duration-300 group-hover:scale-110">
                  {item.step}
                </div>

                {/* Wireframe Illustration */}
                <div className="mb-5">{item.illustration}</div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition-colors text-left">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 text-left font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
