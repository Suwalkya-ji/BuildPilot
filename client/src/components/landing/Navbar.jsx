import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="anim-up flex flex-wrap items-center justify-between gap-4 py-6">
      <Logo />

      <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-muted md:flex">
        <a href="#features" className="link-underline hover:text-fg">Features</a>
        <a href="#workflow" className="link-underline hover:text-fg">How it works</a>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <ThemeToggle className="h-11 w-11" />

        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary h-11 px-5">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="link-underline inline-flex h-11 items-center px-2 text-sm font-medium text-fg sm:px-4"
            >
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary h-11 px-4 sm:px-5">
              Get started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
