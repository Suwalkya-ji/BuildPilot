import { useContext } from "react";
import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Logo = ({ className = "", showText = true }) => {
  const auth = useContext(AuthContext);
  const targetPath = auth?.token ? "/dashboard" : "/";

  return (
    <Link to={targetPath} className={`inline-flex items-center gap-2.5 font-bold text-fg ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-brand text-logo-mark">
        <Layers className="h-[18px] w-[18px]" />
      </span>
      {showText && (
        <span className="whitespace-nowrap text-[17px]">
          BuildPilot<span className="ml-0.5 font-display text-lg font-normal italic text-accent-ink">AI</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
