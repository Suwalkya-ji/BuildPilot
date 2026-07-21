import ProjectCard from "./ProjectCard";

export const ProjectSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-[#131722]/80 p-5 space-y-4 animate-pulse backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white/10 rounded-xl" />
            <div className="h-4 w-28 bg-white/10 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/5 rounded-md" />
            <div className="h-3 w-3/4 bg-white/5 rounded-md" />
          </div>
          <div className="h-5 w-16 bg-white/10 rounded-full" />
          <div className="space-y-1 pt-3 border-t border-white/10">
            <div className="h-2.5 w-24 bg-white/5 rounded" />
            <div className="h-2.5 w-16 bg-white/5 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-4 w-4 bg-white/10 rounded" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProjectGrid;
