import { useState, useMemo } from "react";
import { buildPreviewHtml } from "../../utils/previewBuilder";
import { RefreshCw } from "lucide-react";

const Preview = ({ files = [] }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Rebuild HTML when files change
  const htmlDoc = useMemo(() => {
    if (!files || files.length === 0) return null;
    return buildPreviewHtml(files);
  }, [files]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleOpenNewTab = () => {
    if (!htmlDoc) return;
    const blob = new Blob([htmlDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <section className="flex h-full flex-col bg-surface" aria-label="Live preview">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-3.5">
        <span className="eyebrow">Live preview</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRefresh}
            aria-label="Refresh preview"
            title="Refresh preview"
            className="btn btn-icon anim-spin-hover h-[30px] w-[30px]"
          >
            <RefreshCw
              className={`h-[13px] w-[13px] transition-transform duration-500 ease-in-out ${isRefreshing ? "rotate-[360deg]" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            disabled={!htmlDoc}
            title="Open preview in new tab"
            className="btn btn-ghost h-[30px] px-3 text-xs"
          >
            Open in new tab
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-3">
        <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-bg">
          {files.length === 0 || !htmlDoc ? (
            <div className="flex h-full flex-col gap-5 overflow-hidden p-4" role="status">
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <span>Waiting for AI to generate files…</span>
              </div>
              <div className="shimmer h-24 shrink-0 rounded-lg bg-tint" aria-hidden="true" />
              <div className="grid shrink-0 grid-cols-3 gap-2" aria-hidden="true">
                <div className="shimmer h-16 rounded-lg bg-tint" />
                <div className="shimmer h-16 rounded-lg bg-tint" />
                <div className="shimmer h-16 rounded-lg bg-tint" />
              </div>
              <div className="flex flex-col gap-1.5" aria-hidden="true">
                <div className="shimmer h-2 w-3/5 rounded bg-tint" />
                <div className="shimmer h-2 w-2/5 rounded bg-tint" />
              </div>
            </div>
          ) : (
            /* Fast srcDoc iframe — no WebContainer, renders instantly */
            <iframe
              key={iframeKey}
              title="BuildPilot Live Preview"
              srcDoc={htmlDoc}
              className="h-full w-full border-none bg-surface"
              sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Preview;
