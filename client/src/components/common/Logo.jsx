import { useContext } from "react";
import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Logo = ({ className = "" }) => {
  const auth = useContext(AuthContext);
  const targetPath = auth?.token ? "/dashboard" : "/";

  return (
    <Link to={targetPath} className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-white ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/20">
        <Layers className="h-4 w-4" />
      </span>
      <span className="text-base tracking-tight font-extrabold text-white">
        BuildPilot <span className="text-xs font-semibold text-cyan-300 opacity-90">AI</span>
      </span>
    </Link>
  );
};

export default Logo;