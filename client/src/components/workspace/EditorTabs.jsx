import { X, FolderTree } from "lucide-react";

const EditorTabs = ({ openTabs, activeFile, onSelectTab, onCloseTab, isFilesOpen, onOpenFiles }) => {
  return (
    <div className="no-scrollbar flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-line bg-surface px-2 select-none">
      {!isFilesOpen && (
        <button
          type="button"
          onClick={onOpenFiles}
          title="Open files panel"
          aria-label="Open files panel"
          className="btn btn-ghost mr-1 h-7 shrink-0 px-2.5 text-xs"
        >
          <FolderTree className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Files</span>
        </button>
      )}

      <div role="tablist" aria-label="Open files" className="flex items-center gap-0.5">
        {openTabs.map((path) => {
          const isActive = activeFile === path;
          const fileName = path.split("/").pop();

          return (
            <div
              key={path}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              title={path}
              onClick={() => onSelectTab(path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectTab(path);
                }
              }}
              style={isActive ? { boxShadow: "inset 0 -2px 0 var(--accent)" } : undefined}
              className={`group inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap px-3.5 font-mono text-[12.5px] transition-colors outline-none focus-visible:bg-tint ${
                isActive ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              <span>{fileName}</span>
              {openTabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`Close ${fileName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(path);
                  }}
                  className="-mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-muted opacity-0 transition hover:bg-tint hover:text-fg focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditorTabs;
