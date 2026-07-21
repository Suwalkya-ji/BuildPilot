import { Link } from "react-router-dom";
import { Folder, ExternalLink, MoreHorizontal, Cpu, ShieldCheck, BarChart2 } from "lucide-react";

const ProjectCard = ({ project, onDelete }) => {
  const statusBadges = {
    completed: { label: "Ready", style: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    generating: { label: "• Generating", style: "bg-amber-500/20 text-amber-300 border-amber-400/30 animate-pulse" },
    queued: { label: "Building", style: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
    failed: { label: "Failed", style: "bg-rose-500/20 text-rose-300 border-rose-400/30" },
  };

  const badge = statusBadges[project.status] || statusBadges.completed;

  // Icon selector based on title keywords
  const getIcon = () => {
    const titleLower = (project.title || "").toLowerCase();
    if (titleLower.includes("model") || titleLower.includes("ai")) return Cpu;
    if (titleLower.includes("auth") || titleLower.includes("user")) return ShieldCheck;
    if (titleLower.includes("analytics") || titleLower.includes("chart")) return BarChart2;
    return Folder;
  };

  const CardIcon = getIcon();

  return (
    <div className="card-conic-glow group">
      <div className="card-conic-glow-inner flex flex-col justify-between p-5 text-left">
        <div>
          {/* Header Icon + Title matching Image 3 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-cyan-300 transition-colors">
              <CardIcon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {project.title}
            </h3>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 font-medium">
            {project.description || project.prompt || "AI generated full-stack MERN application."}
          </p>

          {/* Status Pill Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${badge.style}`}>
              {badge.label}
            </span>
          </div>
        </div>

        <div>
          {/* Dates Info */}
          <div className="space-y-1 text-[11px] text-slate-500 font-mono mb-4 border-t border-white/10 pt-3">
            <p>Created: {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            <p>Last Update: 2 hrs ago</p>
          </div>

          {/* Card Footer matching Image 3 */}
          <div className="flex items-center justify-between">
            <Link
              to={`/project/${project._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Open IDE <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={() => onDelete(project)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
              title="Delete Project"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
