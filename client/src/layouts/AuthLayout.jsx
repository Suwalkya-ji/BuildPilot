import { Outlet, Link } from "react-router-dom";
import { Layers } from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg md:flex-row">
      {/* Brand panel — stacks on top on mobile */}
      <aside className="flex flex-col justify-between gap-8 bg-brand p-6 text-on-brand sm:p-10 md:w-[42%] md:max-w-[600px] md:gap-12 md:p-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold">
            <span className="anim-float flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-black/25 text-logo-mark">
              <Layers className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            BuildPilot AI
          </Link>
          <ThemeToggle className="h-11 w-11 border-on-brand/30 text-on-brand" />
        </div>

        <div className="anim-up flex flex-col gap-5">
          <h1 className="font-display text-[40px] leading-none sm:text-5xl lg:text-6xl">
            From a sentence to a <em className="text-logo-mark">working site.</em>
          </h1>
          <p className="max-w-[420px] text-[15px] leading-relaxed text-on-brand/75 sm:text-[17px]">
            Sign in to pick up your projects, preview them live and keep building with AI.
          </p>
        </div>

        <p className="hidden text-[13px] text-on-brand/75 md:block">
          © {new Date().getFullYear()} BuildPilot AI
        </p>
      </aside>

      {/* Form side */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 md:py-12">
        <div className="card anim-up d1 w-full max-w-[400px] rounded-[20px] p-7 sm:p-9">
          <Outlet />
        </div>
      </main>

      <p className="pb-8 text-center text-[13px] text-muted md:hidden">
        © {new Date().getFullYear()} BuildPilot AI
      </p>
    </div>
  );
};

export default AuthLayout;
