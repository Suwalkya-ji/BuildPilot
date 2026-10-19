import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatRelativeTime } from "./relativeTime";

const ProjectCard = ({ project, onDelete }) => {
  const initial = (project.title || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="card card-hover flex min-w-0 flex-col gap-3.5 p-[22px]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="card-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-icon-tile font-display text-[22px] text-icon-ink"
          aria-hidden="true"
        >
          {initial}
        </span>
        <StatusBadge status={project.status} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h2 className="truncate text-[17px] font-semibold text-fg">{project.title}</h2>
        <p className="line-clamp-2 text-sm leading-normal text-muted">
          {project.description || project.prompt || "AI generated full-stack MERN application."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3.5">
        <span className="truncate text-xs text-muted">Updated {formatRelativeTime(project.updatedAt)}</span>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onDelete(project)}
            aria-label="Delete project"
            title="Delete project"
            className="btn btn-icon h-9 w-9 text-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <Link to={`/project/${project._id}`} className="btn btn-brand h-9 px-4 text-[13px]">
            Open
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
