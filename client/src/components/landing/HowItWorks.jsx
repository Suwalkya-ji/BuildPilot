const steps = [
  { n: "1", delay: "0s", out: "your prompt", title: "Describe your idea", body: "Write what you want to build — pages, style and features." },
  { n: "2", delay: "1.8s", out: "8 files generated", title: "AI generates", body: "Gemini writes the project and indexes it for later edits." },
  { n: "3", delay: "3.6s", out: "preview ready", title: "Edit & preview", body: "Tweak code in the editor and watch the preview update." },
  { n: "4", delay: "5.4s", out: "project.zip", title: "Iterate & export", body: "Refine with chat, then export production-ready code." },
];

const HowItWorks = () => {
  return (
    <section id="workflow" className="flex scroll-mt-6 flex-col gap-10 pb-16 pt-12 md:pb-24">
      <div className="reveal flex max-w-[640px] flex-col gap-3">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">How it works</div>
        <h2 className="font-display text-4xl font-normal leading-[1.05] sm:text-5xl">Four steps. No setup.</h2>
      </div>

      <div className="reveal relative grid grid-cols-1 gap-8 rounded-3xl border border-line bg-surface px-5 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6 md:px-7">
        <div
          aria-hidden="true"
          className="flow-track absolute left-[calc(12.5%+14px)] right-[calc(12.5%+14px)] top-[60px] h-0.5 bg-line"
        >
          <div
            className="flow-dash absolute inset-0 opacity-55"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, var(--accent) 0 10px, transparent 10px 20px)",
            }}
          />
          <div
            className="flow-travel absolute -top-1.5 -ml-[7px] h-3.5 w-3.5 rounded-full bg-accent"
            style={{ boxShadow: "0 0 0 6px var(--accent-soft)" }}
          />
        </div>

        {steps.map((s) => (
          <div
            key={s.n}
            className="relative flex flex-col items-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-14 w-14" aria-hidden="true">
              <span className="absolute inset-0 inline-flex items-center justify-center rounded-full border-2 border-line bg-bg font-display text-[28px] text-accent-ink">
                {s.n}
              </span>
              <span
                className="flow-node absolute inset-0 inline-flex items-center justify-center rounded-full bg-accent font-display text-[28px] text-on-accent"
                style={{ animationDelay: s.delay, boxShadow: "0 0 0 8px var(--accent-soft)" }}
              >
                {s.n}
              </span>
            </div>
            <h3 className="mt-1 text-lg font-semibold">
              <span className="sr-only">Step {s.n}: </span>
              {s.title}
            </h3>
            <p className="max-w-[240px] text-[14.5px] leading-relaxed text-muted">{s.body}</p>
            <span
              className="flow-out inline-flex h-[30px] items-center gap-1.5 rounded-full bg-tint px-3 font-mono text-xs text-fg"
              style={{ animationDelay: s.delay }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {s.out}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
