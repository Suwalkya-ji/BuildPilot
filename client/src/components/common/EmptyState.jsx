import { FolderPlus } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderPlus,
  title = "No projects found",
  description = "Get started by creating your first AI React website project.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
