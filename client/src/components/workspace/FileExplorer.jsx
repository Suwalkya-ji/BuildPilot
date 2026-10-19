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
    <aside className="flex h-full flex-col gap-1.5 bg-surface px-2.5 py-3.5 select-none" aria-label="Project files">
      <div className="flex items-center justify-between pl-1.5 pb-1">
        <span className="eyebrow">Files</span>
        <button
          type="button"
          onClick={onClose}
          title="Collapse files panel"
          aria-label="Collapse files panel"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-tint hover:text-fg"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      <label className="mb-1 flex h-[34px] items-center gap-2 rounded-[10px] border border-line bg-bg px-2.5 text-muted transition-colors focus-within:border-accent">
        <Search className="h-[13px] w-[13px] shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files"
          aria-label="Search files"
          className="min-w-0 flex-1 bg-transparent text-xs text-fg outline-none placeholder:text-muted"
        />
      </label>

      <div className="-mx-1 flex-1 overflow-y-auto px-1">
        <FileTree files={filteredFiles} activeFile={activeFile} onSelectFile={onSelectFile} />
      </div>
    </aside>
  );
};

export default FileExplorer;
