import { Search, ChevronsLeft } from "lucide-react";
import FileTree from "./FileTree";

const FileExplorer = ({ files, activeFile, onSelectFile }) => {
  return (
    <div className="flex h-full flex-col bg-[#11141f] border-r border-white/10 select-none">
      {/* Header FILES matching Image 2 */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">
        <span>FILES</span>
        <ChevronsLeft className="h-3.5 w-3.5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
      </div>

      {/* Search Input Box matching Image 2 */}
      <div className="p-3 border-b border-white/10">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl bg-[#090b10] border border-white/10 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto p-2">
        <FileTree files={files} activeFile={activeFile} onSelectFile={onSelectFile} />
      </div>
    </div>
  );
};

export default FileExplorer;
