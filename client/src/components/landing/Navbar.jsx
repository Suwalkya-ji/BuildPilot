import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-2 sm:px-4 select-none !bg-transparent !border-none !shadow-none">
      <div className="flex h-14 items-center justify-between rounded-full border border-white/20 bg-[#161b26]/90 px-3 sm:px-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl transition-all duration-300">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="nav-link-animated">Features</a>
          <a href="#how-it-works" className="nav-link-animated">Workflow</a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-glow-btn shrink-0">
              <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-white font-bold flex items-center gap-1.5 whitespace-nowrap !px-3 sm:!px-4">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-glow-btn shrink-0">
                <span className="nav-glow-btn-inner !text-white font-bold whitespace-nowrap !px-2.5 sm:!px-4 text-xs">
                  Log In
                </span>
              </Link>

              <Link to="/signup" className="nav-glow-btn shrink-0">
                <span className="nav-glow-btn-inner bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 !text-white font-bold whitespace-nowrap !px-3 sm:!px-4 text-xs">
                  Get Started
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
