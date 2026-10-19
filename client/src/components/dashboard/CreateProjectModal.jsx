import { useState, useEffect } from "react";
import { X } from "lucide-react";

const CreateProjectModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [framework] = useState("react");

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
      className="anim-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-scrim p-4 pt-[10vh] sm:p-6 sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div className="card anim-pop w-full max-w-[520px] rounded-[22px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 id="create-modal-title" className="font-display text-[32px] leading-tight text-fg">
            New project
          </h2>
          <button type="button" onClick={onClose} aria-label="Close modal" className="btn btn-icon">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-left">
          <div className="label">
            <label htmlFor="project-title">Project name</label>
            <input
              id="project-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Portfolio Site"
              className="field h-[46px]"
            />
          </div>

          <div className="label">
            <label htmlFor="project-description">Description (optional)</label>
            <input
              id="project-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of your website"
              className="field h-[46px]"
            />
          </div>

          <div className="label">
            <label htmlFor="project-prompt">What should the AI build?</label>
            <textarea
              id="project-prompt"
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A portfolio site with a dark hero, projects grid and contact form"
              className="field"
            />
          </div>

          <span className="inline-flex h-[30px] items-center self-start rounded-full bg-icon-tile px-3 font-mono text-xs text-fg">
            React 18 + Tailwind CSS
          </span>

          <div className="flex flex-wrap justify-end gap-2.5 pt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost h-[46px] px-5">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary h-[46px] px-[22px]">
              {isSubmitting ? "Creating..." : "Create & open IDE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
