import { Plus, FolderGit2, Sparkles, Cpu } from "lucide-react";

const DashboardHeader = ({ onCreateClick, projectCount = 0 }) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            My Projects <Sparkles className="h-6 w-6 text-cyan-400" />
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Manage, generate, and monitor your full-stack AI web applications
          </p>
        </div>

        <button onClick={onCreateClick} className="nav-glow-btn">
          <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-xs text-white font-bold">
            <Plus className="h-4 w-4 mr-1.5 inline" /> New Project
          </span>
        </button>
      </div>

      {/* Metric Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#131722]/80 p-4 flex items-center gap-3 backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Total Projects</p>
            <p className="text-lg font-extrabold text-white">{projectCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#131722]/80 p-4 flex items-center gap-3 backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">AI Engine Status</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Groq Llama 3.3 Active
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#131722]/80 p-4 flex items-center gap-3 backdrop-blur-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">Live Sandbox</p>
            <p className="text-xs font-bold text-indigo-300">Fast React UMD Bundler</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
