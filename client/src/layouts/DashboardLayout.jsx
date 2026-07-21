import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import ThemeToggle from "../components/common/ThemeToggle";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0d13] text-slate-100 selection:bg-cyan-500 selection:text-white select-none">
      {/* Clean Dashboard Top Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#131722]/90 px-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className={`nav-link-animated text-xs font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === link.path
                    ? "text-cyan-300 font-extrabold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* User Profile & Logout Action — desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-extrabold text-white shadow-md">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "BP"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name || "User"}</p>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            </div>

            <button
              onClick={handleLogout}
              aria-label="Sign out of BuildPilot"
              className="ml-2 flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="sm:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute right-0 top-16 w-64 bg-[#131722] border-l border-white/10 h-[calc(100vh-4rem)] flex flex-col p-5 gap-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-extrabold text-white shadow-md">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "BP"}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user?.name || "User"}</p>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    location.pathname === link.path
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <button
                onClick={handleLogout}
                aria-label="Sign out of BuildPilot"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#131722]/80 px-6 py-4 text-center text-xs text-slate-400 font-medium">
        BuildPilot AI — Full-Stack MERN Development Platform
      </footer>
    </div>
  );
};

export default DashboardLayout;

