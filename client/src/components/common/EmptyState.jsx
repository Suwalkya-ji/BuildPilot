import { FolderPlus } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderPlus,
  title = "No projects found",
  description = "Get started by creating your first AI React website project.",
  action,
}) => {
  return (
    <div className="anim-up flex flex-col items-center justify-center rounded-[18px] border border-dashed border-line-strong bg-surface p-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-icon-tile text-icon-ink">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-3xl text-fg">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
