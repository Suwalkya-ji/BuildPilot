import { X, FileCode2 } from "lucide-react";

const EditorTabs = ({ openTabs, activeFile, onSelectTab, onCloseTab }) => {
  return (
    <div className="flex h-9 overflow-x-auto border-b border-slate-800 bg-slate-950 px-1 select-none scrollbar-none">
      {openTabs.map((path) => {
        const isActive = activeFile === path;
        const fileName = path.split("/").pop();

        return (
          <div
            key={path}
            onClick={() => onSelectTab(path)}
            className={`group flex items-center gap-2 border-r border-slate-800/80 px-3 py-1.5 text-xs font-mono cursor-pointer transition ${
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
