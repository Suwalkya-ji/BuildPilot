import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Download, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import StatusBadge from "../common/StatusBadge";
import JSZip from "jszip";
import { toast } from "sonner";

const WorkspaceHeader = ({ projectTitle, status, onSave, isSaving, files = [], isFilesOpen, onToggleFiles }) => {
  const [isExporting, setIsExporting] = useState(false);

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
    <header className="flex min-h-[60px] shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-2 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          to="/dashboard"
          aria-label="Back to projects"
          title="Back to projects"
          className="btn btn-icon h-9 w-9 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {onToggleFiles && (
          <button
            type="button"
            onClick={onToggleFiles}
            title={isFilesOpen ? "Collapse files panel" : "Open files panel"}
            aria-label={isFilesOpen ? "Collapse files panel" : "Open files panel"}
            aria-pressed={isFilesOpen}
            className="btn btn-icon hidden h-9 w-9 shrink-0 md:inline-flex"
          >
            {isFilesOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
        )}

        <h1 className="min-w-0 truncate font-display text-xl leading-tight sm:text-2xl">
          {projectTitle || "Untitled project"}
        </h1>

        <StatusBadge status={status} className="shrink-0" />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle className="h-9 w-9" />

        <button
          type="button"
          onClick={handleExportZip}
          disabled={isExporting || files.length === 0}
          aria-label="Export project code as ZIP"
          title="Export project code as ZIP"
          className="btn btn-ghost h-9 w-9 px-0 text-[13px] sm:w-auto sm:px-3.5"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4 sm:hidden" />
          )}
          <span className="hidden sm:inline">{isExporting ? "Exporting…" : "Export ZIP"}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          aria-label="Save project changes"
          title="Save project changes (Ctrl+S)"
          className="btn btn-primary h-9 px-4 text-[13px]"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isSaving ? "Saving…" : "Save"}</span>
        </button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
