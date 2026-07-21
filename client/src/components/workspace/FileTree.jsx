import { FileCode2 } from "lucide-react";

const FileItem = ({ path, activeFile, onSelect }) => {
  const isActive = activeFile === path;
  const fileName = path.split("/").pop();

  return (
    <div
      onClick={() => onSelect(path)}
      className={`flex items-center gap-2 rounded-lg px-2 py-1 text-xs cursor-pointer select-none transition ${
        isActive
          ? "bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
      }`}
    >
      <FileCode2 className={`h-3.5 w-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
      <span className="truncate">{fileName}</span>
    </div>
  );
};

const FileTreeSkeleton = () => {
  return (
    <div className="space-y-2 p-2 font-mono animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-white/5 border border-white/5">
          <div className="h-3.5 w-3.5 bg-white/10 rounded" />
          <div className={`h-3 bg-white/10 rounded ${i % 2 === 0 ? "w-24" : "w-16"}`} />
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
    <div className="space-y-0.5 p-2 font-mono">
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
