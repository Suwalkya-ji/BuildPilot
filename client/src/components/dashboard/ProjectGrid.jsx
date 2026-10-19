import ProjectCard from "./ProjectCard";

const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

export const ProjectSkeletonGrid = () => {
  return (
    <div className={GRID} aria-busy="true" aria-label="Loading projects">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card flex animate-pulse flex-col gap-3.5 p-[22px]">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[11px] bg-tint" />
            <div className="h-6 w-16 rounded-full bg-tint" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-36 rounded-md bg-tint" />
            <div className="h-3 w-full rounded-md bg-tint" />
            <div className="h-3 w-3/4 rounded-md bg-tint" />
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3.5">
            <div className="h-3 w-24 rounded bg-tint" />
            <div className="h-9 w-24 rounded-full bg-tint" />
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectGrid = ({ projects, onDelete, isLoading }) => {
  if (isLoading) {
    return <ProjectSkeletonGrid />;
  }

  return (
    <div className={`anim-up d2 ${GRID}`}>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProjectGrid;
