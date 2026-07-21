import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const CreateProjectModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("react");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, prompt, framework });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-[#131722] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
            <h2 id="create-modal-title" className="text-base font-extrabold text-white">Create New MERN Project</h2>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Project Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI E-Commerce SaaS Store"
              className="w-full rounded-xl bg-[#0b0d13] border border-white/15 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of your website"
              className="w-full rounded-xl bg-[#0b0d13] border border-white/15 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Initial AI Prompt</label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the MERN & React website you want AI to generate..."
              className="w-full rounded-xl bg-[#0b0d13] border border-white/15 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Framework</label>
            <div className="w-full rounded-xl bg-[#0b0d13] border border-white/15 px-4 py-2.5 text-xs text-slate-300 font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              MERN Stack (React 18 + Tailwind CSS)
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="nav-glow-btn">
              <span className="nav-glow-btn-inner bg-white/10 px-5 py-2 text-xs font-bold text-slate-300">
                Cancel
              </span>
            </button>

            <button type="submit" disabled={isSubmitting} className="nav-glow-btn">
              <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-6 py-2 text-xs font-bold text-white">
                {isSubmitting ? "Creating..." : "Create & Start IDE"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
