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
    { label: "Projects", path: "/dashboard" },
  ];

  const displayName = user?.name || "User";
  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "BP";

  const avatar = (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-on-brand"
      aria-hidden="true"
    >
      {initials}
    </span>
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-7">
            <Logo />
            <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Main navigation">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex h-9 items-center rounded-full px-3.5 transition-colors ${
                      active ? "bg-icon-tile font-semibold text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />

            {/* User + sign out — desktop */}
            <div className="hidden items-center gap-3 sm:flex">
              {avatar}
              <span className="max-w-[160px] truncate text-sm font-medium">{displayName}</span>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out of BuildPilot"
                className="btn btn-ghost h-9 px-3.5 text-[13px] text-muted"
              >
                Sign out
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="btn btn-icon sm:hidden"
            >
              {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="anim-fade fixed inset-0 top-[68px] z-30 bg-scrim sm:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="anim-panel absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col gap-4 border-l border-line bg-surface p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info */}
            <div className="flex items-center gap-3 border-b border-line pb-4">
              {avatar}
              <p className="min-w-0 truncate text-sm font-medium">{displayName}</p>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-11 items-center rounded-full px-4 text-sm transition-colors ${
                      active ? "bg-icon-tile font-semibold text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto">
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out of BuildPilot"
                className="btn btn-ghost h-11 w-full"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="w-full flex-1 py-10 pb-16">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
