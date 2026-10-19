import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-bg px-4 text-center text-fg">
      <div
        aria-hidden="true"
        className="orb orb-drift-1 -left-20 -top-[120px] h-[360px] w-[360px]"
        style={{ background: "var(--orb-1)" }}
      />
      <div className="anim-up relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-icon-tile text-icon-ink">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </div>
      <p className="eyebrow anim-up d1 relative">Error 404</p>
      <h1 className="anim-up d2 relative mt-3 font-display text-5xl font-normal leading-none sm:text-6xl">
        Page not found
      </h1>
      <p className="anim-up d3 relative mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary anim-up d4 relative mt-8 h-11 px-6">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
      </Link>
    </div>
  );
};

export default NotFound;
