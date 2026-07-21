import { Sparkles, Layers, PlayCircle, Bot, Code2, Download } from "lucide-react";
import Container from "../common/Container";

const userFeatures = [
  {
    icon: Sparkles,
    title: "Instant AI Web Generation",
    description: "Type your website prompt in plain English to generate a complete multi-file MERN & React application.",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    icon: Layers,
    title: "Full-Stack & MERN Persistence",
    description: "Built-in interactive state management, client-side data persistence, and full CRUD capabilities.",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
  },
  {
    icon: PlayCircle,
    title: "Live Hot-Reloading Preview",
    description: "Real-time Sandpack browser preview as soon as AI generates or updates your project code.",
    gradient: "from-indigo-600 via-purple-600 to-fuchsia-600",
  },
  {
    icon: Bot,
    title: "Context-Aware AI Chat",
    description: "Modify components, styles, and layouts iteratively with Qdrant RAG vector search context.",
    gradient: "from-purple-600 via-fuchsia-500 to-pink-500",
  },
  {
    icon: Code2,
    title: "In-Browser Monaco Editor",
    description: "Full VS Code editing experience in your browser with multi-tab navigation and syntax highlighting.",
    gradient: "from-cyan-500 via-indigo-500 to-fuchsia-500",
  },
  {
    icon: Download,
    title: "Clean Production Code Export",
    description: "Export clean, modular, production-ready React & Tailwind CSS codebase anytime.",
    gradient: "from-indigo-500 via-violet-600 to-purple-600",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <Container>
        {/* Left Aligned Section Title */}
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-10 text-left">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFeatures.map((item, idx) => (
            <div key={idx} className="card-conic-glow group">
              <div className="card-conic-glow-inner">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${item.gradient} text-white shadow-md ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
