import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, Download, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import JSZip from "jszip";
import { toast } from "sonner";

const WorkspaceHeader = ({ projectTitle, status, onSave, isSaving, files = [], isFilesOpen, onToggleFiles }) => {
  const [isExporting, setIsExporting] = useState(false);

  const statusBadges = {
    generating: { label: "Generating...", color: "bg-amber-500/20 text-amber-200 border-amber-400/30" },
    queued: { label: "Queued", color: "bg-blue-500/20 text-blue-200 border-blue-400/30" },
    completed: { label: "Ready", color: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" },
    failed: { label: "Failed", color: "bg-rose-500/20 text-rose-200 border-rose-400/30" },
  };

  const badge = statusBadges[status] || statusBadges.completed;

  const handleExportZip = async () => {
    if (!files || files.length === 0) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      files.forEach((f) => {
        let p = (f.path || f.filePath || "").trim().replace(/^\//, "");
        if (p) zip.file(p, f.content || "");
      });

      if (!files.some(f => (f.path || f.filePath || "").includes("package.json"))) {
        zip.file("package.json", JSON.stringify({
          name: (projectTitle || "buildpilot-project").toLowerCase().replace(/[^a-z0-9]/g, "-"),
          private: true,
          version: "1.0.0",
          type: "module",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.263.1",
            tailwindcss: "^3.3.0"
          }
        }, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const filename = `${(projectTitle || "buildpilot-project").toLowerCase().replace(/[^a-z0-9]/g, "-")}-codebase.zip`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${filename} successfully!`);
    } catch (err) {
      console.error("Export zip error:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#131722]/90 px-2 sm:px-4 select-none shadow-xl backdrop-blur-xl shrink-0 overflow-hidden">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <Link
          to="/dashboard"
          aria-label="Back to Dashboard"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-200 hover:text-white transition hover:scale-110 active:scale-95 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {onToggleFiles && (
          <button
            onClick={onToggleFiles}
            title={isFilesOpen ? "Collapse Files Sidebar" : "Open Files Sidebar"}
            aria-label={isFilesOpen ? "Collapse Files Sidebar" : "Open Files Sidebar"}
            className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-cyan-300 transition cursor-pointer"
          >
            {isFilesOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4 text-cyan-400" />
            )}
          </button>
        )}

        <div className="shrink-0">
          <Logo />
        </div>

        <span className="hidden sm:inline text-white/30 font-light">|</span>

        <h1 className="text-xs font-bold text-slate-200 truncate max-w-[70px] xs:max-w-[120px] sm:max-w-xs md:max-w-md font-mono shrink">
          {projectTitle ? `${projectTitle} / React.js` : "BuildPilot Project / React.js"}
        </h1>

        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold shrink-0 ${badge.color}`}>
          <Sparkles className="h-2.5 w-2.5" />
          <span className="hidden xs:inline">{badge.label}</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <ThemeToggle />

        <button
          onClick={handleExportZip}
          disabled={isExporting || files.length === 0}
          aria-label="Export project code as ZIP"
          title="Export project code as ZIP"
          className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 hover:border-cyan-400/40 active:scale-95 transition disabled:opacity-40 shrink-0"
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          ) : (
            <Download className="h-3.5 w-3.5 text-cyan-400" />
          )}
          <span className="hidden md:inline">{isExporting ? "Exporting..." : "Export Code"}</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          aria-label="Save project changes"
          title="Save project changes"
          className="nav-glow-btn active:scale-95 transition-transform shrink-0"
        >
          <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-3 sm:px-5 py-1.5 text-xs text-white font-bold flex items-center gap-1.5 whitespace-nowrap">
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Save Changes</span>
              </>
            )}
          </span>
        </button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
