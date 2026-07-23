import { useState } from "react";
import { Search, ChevronsLeft } from "lucide-react";
import FileTree from "./FileTree";

const FileExplorer = ({ files = [], activeFile, onSelectFile, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter((f) => {
    const path = f.path || f.filePath || "";
    return path.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col bg-[#11141f] border-r border-white/10 select-none">
      {/* Header FILES with Close Arrow */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">
        <span>FILES</span>
        <button
          onClick={onClose}
          title="Collapse Files Sidebar"
          aria-label="Collapse Files Sidebar"
          className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input Box */}
      <div className="p-3 border-b border-white/10">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-xl bg-[#090b10] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-2">
        <FileTree files={filteredFiles} activeFile={activeFile} onSelectFile={onSelectFile} />
      </div>
    </div>
  );
};

export default FileExplorer;
