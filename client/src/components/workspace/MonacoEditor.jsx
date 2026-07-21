import Editor from "@monaco-editor/react";

const MonacoEditor = ({ activeFile, content, onChange }) => {
  const getLanguage = (filename) => {
    if (!filename) return "javascript";
    if (filename.endsWith(".jsx") || filename.endsWith(".tsx")) return "javascript";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".html")) return "html";
    return "javascript";
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={getLanguage(activeFile)}
        theme="vs-dark"
        value={content || ""}
        onChange={onChange}
        options={{
          fontSize: 13,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "off",
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
