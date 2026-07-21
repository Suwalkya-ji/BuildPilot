import { useState, useMemo } from "react";
import { buildPreviewHtml } from "../../utils/previewBuilder";
import { ExternalLink, Play, RefreshCw } from "lucide-react";

const Preview = ({ files = [], projectId }) => {
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
    <div className="flex h-full flex-col bg-[#11141f] border-b border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] font-mono text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Play className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">LIVE PREVIEW</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/30 active:scale-90 transition-all duration-200 shadow-sm hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]"
            title="Refresh Preview"
          >
            <RefreshCw className={`h-3.5 w-3.5 transition-transform duration-500 ease-in-out ${isRefreshing ? "rotate-[360deg] text-cyan-400" : ""}`} />
          </button>

          <button
            onClick={handleOpenNewTab}
            disabled={!htmlDoc}
            className="nav-glow-btn active:scale-95 transition-transform duration-150 disabled:opacity-40"
            title="Open Preview in New Tab"
          >
            <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 py-1 px-3.5 text-[11px] font-bold text-white shadow-lg hover:shadow-cyan-500/25 transition-all">
              Open in New Tab <ExternalLink className="h-3 w-3 ml-1 inline group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden p-2">
        <div className="h-full w-full rounded-xl border border-white/10 overflow-hidden bg-[#090b10]">
          {files.length === 0 || !htmlDoc ? (
            /* No files yet — show waiting state */
            <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500 text-xs font-mono">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <span>Waiting for AI to generate files...</span>
            </div>
          ) : (
            /* Fast srcDoc iframe — no WebContainer, renders instantly */
            <iframe
              key={iframeKey}
              title="BuildPilot Live Preview"
              srcDoc={htmlDoc}
              className="h-full w-full border-none"
              sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
