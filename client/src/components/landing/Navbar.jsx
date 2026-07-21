import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4 select-none">
      <div className="flex h-14 items-center justify-between rounded-full border border-white/20 bg-[#161b26]/90 px-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl transition-all duration-300">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="nav-link-animated">Features</a>
          <a href="#how-it-works" className="nav-link-animated">Workflow</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-glow-btn">
              <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-white font-bold flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" /> Go to Dashboard
              </span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-glow-btn">
                <span className="nav-glow-btn-inner">Log In</span>
              </Link>

              <Link to="/signup" className="nav-glow-btn">
                <span className="nav-glow-btn-inner bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 text-white">
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
