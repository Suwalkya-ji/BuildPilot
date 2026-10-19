// One place for project status labels and colors (Dashboard + Workspace)
const STATUS = {
  completed: { label: "Ready", className: "badge-ready" },
  generating: { label: "Generating", className: "badge-generating", pulse: true },
  queued: { label: "Queued", className: "badge-queued" },
  failed: { label: "Failed", className: "badge-failed" },
};

const StatusBadge = ({ status, className = "" }) => {
  const s = STATUS[status] || STATUS.completed;

  return (
    <span className={`badge ${s.className} ${className}`}>
      <span className={`badge-dot ${s.pulse ? "anim-pulse" : ""}`} />
      {s.label}
    </span>
  );
};

export default StatusBadge;
