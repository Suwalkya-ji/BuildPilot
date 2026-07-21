import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Workspace IDE Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
