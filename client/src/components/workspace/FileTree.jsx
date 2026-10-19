const FileItem = ({ path, activeFile, onSelect }) => {
  const isActive = activeFile === path;
  const fileName = path.split("/").pop();

  return (
    <button
      type="button"
      onClick={() => onSelect(path)}
      title={path}
      aria-current={isActive ? "true" : undefined}
      className={`flex min-h-[34px] w-full items-center gap-2 rounded-[10px] px-2.5 text-left font-mono text-[12.5px] transition-[background-color,color,transform] duration-200 hover:translate-x-[3px] ${
        isActive ? "bg-icon-tile font-semibold text-fg" : "text-muted hover:text-fg"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-[2px] ${isActive ? "bg-accent" : "bg-line-strong"}`}
      />
      <span className="truncate">{fileName}</span>
    </button>
  );
};

const FileTreeSkeleton = () => {
  return (
    <div className="space-y-2 py-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex h-[34px] items-center gap-2 px-2.5">
          <div className="shimmer h-1.5 w-1.5 rounded-[2px] bg-tint" />
          <div className={`shimmer h-2.5 rounded bg-tint ${i % 2 === 0 ? "w-24" : "w-16"}`} />
        </div>
      ))}
    </div>
  );
};

const FileTree = ({ files = [], activeFile, onSelectFile }) => {
  if (!files || files.length === 0) {
    return <FileTreeSkeleton />;
  }

  // Deduplicate files by path to prevent duplicate rendering
  const uniqueFilesMap = new Map();
  files.forEach((file) => {
    const p = file.path || file.filePath;
    if (p && !uniqueFilesMap.has(p)) {
      uniqueFilesMap.set(p, file);
    }
  });

  const uniqueFiles = Array.from(uniqueFilesMap.values());

  return (
    <div className="flex flex-col gap-0.5">
      {uniqueFiles.map((file) => {
        const filePath = file.path || file.filePath;
        return (
          <FileItem
            key={filePath}
            path={filePath}
            activeFile={activeFile}
            onSelect={onSelectFile}
          />
        );
      })}
    </div>
  );
};

export default FileTree;
