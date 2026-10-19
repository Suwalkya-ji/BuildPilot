import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg text-fg">
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
