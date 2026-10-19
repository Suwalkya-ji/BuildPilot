import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const codeLines = [
  {
    delay: "0.8s",
    indent: "",
    content: (
      <>
        <span className="text-code-key">export default</span> <span className="text-code-fn">function</span> App() {"{"}
      </>
    ),
  },
  { delay: "1.05s", indent: "pl-4", content: (<><span className="text-code-key">return</span> (</>) },
  { delay: "1.3s", indent: "pl-8 text-code-tag", content: "<Hero />" },
  { delay: "1.55s", indent: "pl-8 text-code-tag", content: "<Projects />" },
  {
    delay: "1.8s",
    indent: "pl-8 text-code-tag",
    content: (
      <>
        {"<Contact />"}
        <span className="anim-blink ml-0.5 inline-block h-[15px] w-[7px] bg-accent align-[-2px]" />
      </>
    ),
  },
  { delay: "2.05s", indent: "pl-4", content: ");" },
  { delay: "2.3s", indent: "", content: "}" },
];

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const ctaTarget = isAuthenticated ? "/dashboard" : "/signup";
  const ctaLabel = isAuthenticated ? "Open dashboard" : "Start building free";

  return (
    <section className="flex flex-wrap items-center gap-14 pb-[72px] pt-10 md:pt-16">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-7">
        <span className="anim-up d1 inline-flex h-[30px] items-center gap-2 self-start rounded-full border border-line bg-surface px-3.5 text-[13px] text-muted">
          <span className="anim-pulse h-[7px] w-[7px] rounded-full bg-accent" aria-hidden="true" />
          Powered by Google Gemini
        </span>

        <h1 className="anim-up d2 font-display text-5xl font-normal leading-none tracking-[-0.01em] sm:text-6xl lg:text-[76px]">
          Build web apps at the speed of{" "}
          <span className="rotate-words text-accent-ink">
            <em>thought.</em>
            <em>words.</em>
            <em>your ideas.</em>
          </span>
        </h1>

        <p className="anim-up d3 max-w-[520px] text-base leading-relaxed text-muted sm:text-lg">
          Describe your app in plain English. Get a full React + Tailwind project with live preview, a code
          editor and an AI pair-builder — in minutes.
        </p>

        <div className="anim-up d4 flex max-w-[540px] items-center gap-2.5 rounded-full border border-line-strong bg-surface py-2 pl-[18px] pr-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <Sparkles className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
          <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap font-mono text-[13.5px] text-fg">
            <span className="type-loop max-w-[calc(100%-12px)]">a portfolio with a dark hero and contact form</span>
            <span
              className="anim-blink ml-0.5 inline-block h-4 w-[7px] bg-accent align-[-3px]"
              aria-hidden="true"
            />
          </span>
          <Link to={ctaTarget} className="btn btn-primary shine h-[42px] shrink-0 px-[18px]">
            Generate
            <ArrowRight className="btn-arrow h-[15px] w-[15px]" aria-hidden="true" />
          </Link>
        </div>

        <div className="anim-up d5 flex flex-wrap gap-3">
          <Link to={ctaTarget} className="btn btn-brand h-12 px-[22px] text-[15px]">
            {ctaLabel}
          </Link>
          <a href="#workflow" className="btn btn-outline h-12 px-[22px] text-[15px]">
            See how it works
          </a>
        </div>
      </div>

      <div className="anim-up d3 min-w-0 flex-[1_1_480px]" aria-hidden="true">
        <div className="anim-float">
          <div
            className="anim-tilt rounded-[20px] bg-hero-panel p-2.5 sm:p-3.5"
            style={{ boxShadow: "var(--shadow-hero)" }}
          >
            <div className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="flex items-center gap-2 border-b border-line px-3.5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="ml-2 truncate font-mono text-xs text-muted">portfolio-site / src/App.jsx</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="overflow-hidden border-r border-line bg-editor p-3 font-mono text-[11px] leading-[1.8] sm:p-[18px] sm:text-[12.5px]">
                  {codeLines.map((line, i) => (
                    <div key={i} className={`code-line whitespace-nowrap ${line.indent}`} style={{ animationDelay: line.delay }}>
                      {line.content}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5 p-3 sm:p-[18px]">
                  <div className="pop-in h-16 rounded-[10px] bg-brand" style={{ animationDelay: "1.4s" }} />
                  <div className="grid grid-cols-3 gap-2">
                    {["1.7s", "1.85s", "2s"].map((d) => (
                      <div key={d} className="pop-in h-12 rounded-lg bg-tint" style={{ animationDelay: d }} />
                    ))}
                  </div>
                  <div className="pop-in h-2.5 w-[70%] rounded-md bg-tint" style={{ animationDelay: "2.2s" }} />
                  <div className="pop-in h-2.5 w-1/2 rounded-md bg-tint" style={{ animationDelay: "2.3s" }} />
                  <div className="pop-in h-[26px] w-[92px] self-start rounded-full bg-accent" style={{ animationDelay: "2.5s" }} />
                </div>
              </div>
              <div className="flex items-center gap-2.5 border-t border-line px-3.5 py-3 text-[13px] text-muted">
                <span className="anim-pulse h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="rotate-words min-w-0">
                  <span>AI: “Added a contact form with validation.”</span>
                  <span>AI: “Made the hero background darker.”</span>
                  <span>AI: “Linked your LinkedIn profile.”</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
