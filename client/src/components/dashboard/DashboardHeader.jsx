import { Plus } from "lucide-react";

const DashboardHeader = ({ onCreateClick, projectCount = 0, lastUpdated = "—" }) => {
  const stats = [
    { label: "Total projects", value: projectCount },
    { label: "AI engine", value: "Gemini · online" },
    { label: "Last updated", value: lastUpdated },
  ];

  return (
    <div className="mb-8 flex flex-col gap-8">
      {/* Title & action */}
      <div className="anim-up flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[42px] leading-none text-fg sm:text-[52px]">My projects</h1>
          <p className="text-[15px] text-muted">Generate, edit and preview your AI-built web apps.</p>
        </div>

        <button type="button" onClick={onCreateClick} className="btn btn-primary h-12 px-[22px] text-[15px]">
          <Plus className="btn-spin h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          New project
        </button>
      </div>

      {/* Quick stats */}
      <div className="anim-up d1 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card card-hover flex min-w-0 flex-col gap-1.5 rounded-2xl px-[22px] py-5">
            <p className="eyebrow">{stat.label}</p>
            <p className="truncate font-display text-[34px] leading-tight text-fg">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
