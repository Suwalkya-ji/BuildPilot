import { Download, RefreshCw } from "lucide-react";

const illoBox = "h-32 rounded-xl border border-line bg-editor";

const GenerateIllo = () => (
  <div className={`${illoBox} flex flex-col gap-[7px] p-3.5 font-mono text-xs`}>
    <div className="flex items-center gap-2 text-muted">
      <span className="anim-pulse h-[7px] w-[7px] rounded-full bg-accent" />
      generating project…
    </div>
    {["src/App.jsx", "src/Hero.jsx", "src/Projects.jsx", "src/Contact.jsx"].map((file, i) => (
      <div key={file} className="seq-in flex items-center gap-2 text-code-tag" style={{ animationDelay: `${i * 0.45}s` }}>
        <span className="h-1.5 w-1.5 rounded-[2px] bg-accent" />
        {file}
      </div>
    ))}
  </div>
);

const PreviewIllo = () => (
  <div className={`${illoBox} flex flex-col overflow-hidden`}>
    <div className="flex items-center gap-[5px] border-b border-line px-2.5 py-2">
      <span className="h-[7px] w-[7px] rounded-full bg-line" />
      <span className="h-[7px] w-[7px] rounded-full bg-line" />
      <span className="h-[7px] w-[7px] rounded-full bg-line" />
      <span className="flex-1" />
      <span className="inline-flex items-center gap-[5px] font-mono text-[10px] text-muted">
        <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-ok-fg" />
        LIVE
      </span>
      <RefreshCw className="anim-spin-slow h-3 w-3 text-muted" strokeWidth={2.4} />
    </div>
    <div className="flex flex-1 flex-col gap-[7px] p-2.5">
      <div className="h-[34px] animate-pulse rounded-[7px] bg-brand" />
      <div className="grid grid-cols-3 gap-1.5">
        <div className="shimmer h-[26px] rounded-md bg-tint" />
        <div className="shimmer h-[26px] rounded-md bg-tint" />
        <div className="shimmer h-[26px] rounded-md bg-tint" />
      </div>
    </div>
  </div>
);

const ChatIllo = () => (
  <div className={`${illoBox} flex flex-col justify-end gap-[7px] p-3 text-xs`}>
    <div className="chat-1 self-end rounded-[12px_12px_3px_12px] bg-brand px-[11px] py-[7px] text-on-brand">
      Make the buttons rounder
    </div>
    <div className="chat-2 gap-1 self-start rounded-[12px_12px_12px_3px] border border-line bg-surface px-[11px] py-[9px] text-muted">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
    <div className="chat-3 self-start rounded-[12px_12px_12px_3px] border border-line bg-surface px-[11px] py-[7px] text-fg">
      Updated <span className="font-mono text-accent-ink">Button.jsx</span>
    </div>
  </div>
);

const EditorIllo = () => (
  <div className={`${illoBox} relative flex flex-col gap-[9px] overflow-hidden py-3.5 pl-9 pr-3.5`}>
    <div className="scan-line absolute inset-x-0 top-2.5 h-5 bg-accent-soft" />
    <div className="relative h-2 w-[55%] rounded bg-code-key" />
    <div className="relative ml-3.5 h-2 w-[72%] rounded bg-code-tag opacity-80" />
    <div className="relative ml-3.5 h-2 w-[48%] rounded bg-code-tag opacity-80" />
    <div className="relative ml-3.5 h-2 w-[62%] rounded bg-code-fn opacity-70" />
    <div className="relative flex items-center gap-0.5">
      <span className="h-2 w-[30%] rounded bg-code-key" />
      <span className="anim-blink h-3.5 w-0.5 bg-accent" />
    </div>
  </div>
);

const MobileIllo = () => (
  <div className={`${illoBox} flex items-center justify-center`}>
    <div
      className="anim-float flex h-[108px] w-[62px] flex-col gap-1 overflow-hidden rounded-xl border-2 border-fg px-[5px] py-1.5"
      style={{ animationDuration: "4s" }}
    >
      <div className="relative h-2.5 rounded-full bg-tint">
        <div className="tab-slide absolute left-0 top-0 h-2.5 w-1/3 rounded-full bg-accent" />
      </div>
      <div className="flex flex-1 flex-col gap-[3px] rounded-md bg-tint p-1">
        <div className="h-[5px] w-4/5 rounded-[3px] bg-brand" />
        <div className="h-[5px] w-3/5 rounded-[3px] bg-muted opacity-50" />
        <div className="h-[5px] w-[70%] rounded-[3px] bg-muted opacity-50" />
      </div>
    </div>
  </div>
);

const ExportIllo = () => (
  <div className={`${illoBox} relative flex items-end justify-center overflow-hidden pb-3`}>
    {[
      { ext: ".jsx", left: "calc(50% - 44px)", delay: "0s" },
      { ext: ".js", left: "calc(50% - 14px)", delay: "0.5s" },
      { ext: ".json", left: "calc(50% + 14px)", delay: "1s" },
    ].map((f) => (
      <span
        key={f.ext}
        className="file-drop absolute top-2.5 rounded-md border border-line bg-surface px-[7px] py-[3px] font-mono text-[10px] text-code-tag"
        style={{ left: f.left, animationDelay: f.delay }}
      >
        {f.ext}
      </span>
    ))}
    <div className="relative inline-flex h-10 items-center gap-2 rounded-[10px] bg-brand px-3.5 font-mono text-xs text-on-brand">
      <Download className="anim-bounce-y h-3.5 w-3.5" strokeWidth={2.4} />
      project.zip
    </div>
  </div>
);

const features = [
  { Illo: GenerateIllo, title: "Instant AI generation", body: "Type your idea in plain English and get a complete multi-file React project." },
  { Illo: PreviewIllo, title: "Live preview", body: "See your site running in the browser the moment code is generated or changed." },
  { Illo: ChatIllo, title: "Context-aware chat", body: "Ask for changes. The AI reads the relevant files before it edits them." },
  { Illo: EditorIllo, title: "In-browser editor", body: "A full code editor with tabs and syntax highlighting — no install needed." },
  { Illo: MobileIllo, title: "Works on mobile", body: "Review code, preview and chat from your phone with a focused layout." },
  { Illo: ExportIllo, title: "Clean code export", body: "Download a tidy React + Tailwind codebase as a ZIP whenever you want." },
];

const Features = () => {
  return (
    <section id="features" className="flex scroll-mt-6 flex-col gap-10 py-16 md:py-24">
      <div className="reveal flex max-w-[640px] flex-col gap-3">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">Features</div>
        <h2 className="font-display text-4xl font-normal leading-[1.05] sm:text-5xl">
          Everything from prompt to production code.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ Illo, title, body }) => (
          <div key={title} className="reveal">
            <div className="card card-hover flex h-full flex-col gap-3.5 p-[22px]">
              <div aria-hidden="true">
                <Illo />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
