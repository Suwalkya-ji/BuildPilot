import { X, FileCode2, ChevronsRight, FolderTree } from "lucide-react";

const EditorTabs = ({ openTabs, activeFile, onSelectTab, onCloseTab, isFilesOpen, onOpenFiles }) => {
  return (
    <div className="flex h-9 items-center overflow-x-auto border-b border-slate-800 bg-slate-950 px-1 select-none no-scrollbar">
      {!isFilesOpen && (
        <button
          onClick={onOpenFiles}
          title="Open Files Sidebar"
          aria-label="Open Files Sidebar"
          className="flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition cursor-pointer mr-1 shrink-0 shadow-sm whitespace-nowrap"
        >
          <FolderTree className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Files</span>
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      )}

      {openTabs.map((path) => {
        const isActive = activeFile === path;
        const fileName = path.split("/").pop();

        return (
          <div
            key={path}
            onClick={() => onSelectTab(path)}
            className={`group flex items-center gap-2 border-r border-slate-800/80 px-3 py-1.5 text-xs font-mono cursor-pointer transition shrink-0 whitespace-nowrap ${
              isActive
                ? "bg-slate-900 text-indigo-300 font-medium border-t-2 border-t-indigo-500"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
            }`}
          >
            <FileCode2 className={`h-3.5 w-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
            <span>{fileName}</span>
            {openTabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(path);
                }}
                className="rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
