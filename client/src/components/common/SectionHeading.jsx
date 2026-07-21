const SectionHeading = ({ badge, title, subtitle, align = "center", className = "" }) => {
  const alignment = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <div className={`space-y-4 ${alignment} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-gradient-to-r from-blue-500/10 via-violet-500/15 to-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 shadow-sm shadow-violet-500/20 backdrop-blur-md">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          <span className="bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
      )}
      {subtitle && (
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
