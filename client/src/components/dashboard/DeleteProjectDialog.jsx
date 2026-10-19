import { AlertTriangle, X } from "lucide-react";

const DeleteProjectDialog = ({ isOpen, onClose, onConfirm, projectTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-scrim p-4 pt-[14vh] sm:p-6 sm:pt-[16vh]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <div className="card anim-pop w-full max-w-[460px] rounded-[22px] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-err-bg text-err-fg">
            <AlertTriangle className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="btn btn-icon">
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 id="delete-dialog-title" className="mt-4 font-display text-[32px] leading-tight text-fg">
          Delete project
        </h2>
        <p id="delete-dialog-desc" className="mt-2 text-sm leading-relaxed text-muted">
          Are you sure you want to delete <span className="break-words font-semibold text-fg">"{projectTitle}"</span>? This
          will permanently remove all generated files and vector embeddings in Qdrant.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <button type="button" onClick={onClose} className="btn btn-ghost h-[46px] px-5">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="btn btn-danger h-[46px] px-[22px]">
            {isDeleting ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectDialog;
