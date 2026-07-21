import { Link } from "react-router-dom";
import { Files, Folder, GitBranch, Component, Settings, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-12 flex-col items-center justify-between border-r border-white/10 bg-[#0e111a] py-4 select-none">
      {/* Top Action Icons matching Image 2 */}
      <div className="flex flex-col items-center gap-5 text-slate-400">
        <button className="text-white hover:text-cyan-300 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Files">
          <Files className="h-4 w-4" />
        </button>
        <button className="hover:text-cyan-300 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Explorer">
          <Folder className="h-4 w-4" />
        </button>
        <button className="hover:text-cyan-300 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Source Control">
          <GitBranch className="h-4 w-4" />
        </button>
        <button className="hover:text-cyan-300 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Components">
          <Component className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Settings & Logout Icons matching Image 2 */}
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <button className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Profile">
          <User className="h-4 w-4" />
        </button>
        <button onClick={logout} className="hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Settings / Sign Out">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
