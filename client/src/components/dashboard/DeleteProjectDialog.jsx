import { AlertTriangle, X } from "lucide-react";

const DeleteProjectDialog = ({ isOpen, onClose, onConfirm, projectTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-[#131722] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-base font-bold text-white">Delete Project</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-300 leading-relaxed text-left">
          Are you sure you want to delete <span className="font-bold text-white">"{projectTitle}"</span>? This will permanently remove all generated files and vector embeddings in Qdrant.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button type="button" onClick={onClose} className="nav-glow-btn">
            <span className="nav-glow-btn-inner bg-white/10 px-5 py-2 text-xs font-bold text-slate-300">
              Cancel
            </span>
          </button>

          <button type="button" onClick={onConfirm} disabled={isDeleting} className="nav-glow-btn">
            <span className="nav-glow-btn-inner bg-gradient-to-r from-rose-600 to-red-500 px-6 py-2 text-xs font-bold text-white">
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectDialog;
