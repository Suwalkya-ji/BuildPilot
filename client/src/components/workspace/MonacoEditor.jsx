import Editor from "@monaco-editor/react";
import { useTheme } from "../../context/ThemeContext";

// Monaco needs literal colours, so these mirror the design tokens in index.css.
const defineBuildPilotThemes = (monaco) => {
  monaco.editor.defineTheme("bp-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "2E2016" },
      { token: "comment", foreground: "A89A8C", fontStyle: "italic" },
      { token: "keyword", foreground: "8A4B0B" },
      { token: "string", foreground: "3F5F2A" },
      { token: "string.key.json", foreground: "8A4B0B" },
      { token: "string.value.json", foreground: "3F5F2A" },
      { token: "number", foreground: "6B4E8A" },
      { token: "regexp", foreground: "6B4E8A" },
      { token: "type", foreground: "5A3E2B" },
      { token: "type.identifier", foreground: "5A3E2B" },
      { token: "identifier", foreground: "2E2016" },
      { token: "delimiter", foreground: "6B5A4C" },
      { token: "tag", foreground: "3F5F2A" },
      { token: "attribute.name", foreground: "8A4B0B" },
      { token: "attribute.value", foreground: "3F5F2A" },
    ],
    colors: {
      "editor.background": "#FBFAF6",
      "editor.foreground": "#2E2016",
      "editorLineNumber.foreground": "#A89A8C",
      "editorLineNumber.activeForeground": "#5A3E2B",
      "editorCursor.foreground": "#D5851F",
      "editor.selectionBackground": "#D5851F33",
      "editor.inactiveSelectionBackground": "#D5851F1F",
      "editor.lineHighlightBackground": "#87A96B14",
      "editor.lineHighlightBorder": "#00000000",
      "editorIndentGuide.background1": "#D9E0CF",
      "editorIndentGuide.activeBackground1": "#B9A795",
      "editorWidget.background": "#FFFFFF",
      "editorWidget.border": "#D9E0CF",
      "scrollbarSlider.background": "#B9A79555",
      "scrollbarSlider.hoverBackground": "#B9A79588",
    },
  });

  monaco.editor.defineTheme("bp-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "F3F0F7" },
      { token: "comment", foreground: "5E566B", fontStyle: "italic" },
      { token: "keyword", foreground: "C9A6F2" },
      { token: "string", foreground: "7FF2FF" },
      { token: "string.key.json", foreground: "C9A6F2" },
      { token: "string.value.json", foreground: "7FF2FF" },
      { token: "number", foreground: "A7F3D0" },
      { token: "regexp", foreground: "A7F3D0" },
      { token: "type", foreground: "00E5FF" },
      { token: "type.identifier", foreground: "00E5FF" },
      { token: "identifier", foreground: "F3F0F7" },
      { token: "delimiter", foreground: "A69FB3" },
      { token: "tag", foreground: "7FF2FF" },
      { token: "attribute.name", foreground: "C9A6F2" },
      { token: "attribute.value", foreground: "7FF2FF" },
    ],
    colors: {
      "editor.background": "#0A0810",
      "editor.foreground": "#F3F0F7",
      "editorLineNumber.foreground": "#5E566B",
      "editorLineNumber.activeForeground": "#A69FB3",
      "editorCursor.foreground": "#00E5FF",
      "editor.selectionBackground": "#3B0A6B99",
      "editor.inactiveSelectionBackground": "#3B0A6B55",
      "editor.lineHighlightBackground": "#FFFFFF08",
      "editor.lineHighlightBorder": "#00000000",
      "editorIndentGuide.background1": "#FFFFFF14",
      "editorIndentGuide.activeBackground1": "#FFFFFF33",
      "editorWidget.background": "#0F0B16",
      "editorWidget.border": "#FFFFFF17",
      "scrollbarSlider.background": "#FFFFFF22",
      "scrollbarSlider.hoverBackground": "#FFFFFF38",
    },
  });
};

const MonacoEditor = ({ activeFile, content, onChange }) => {
  const { theme } = useTheme();

  const getLanguage = (filename) => {
    if (!filename) return "javascript";
    if (filename.endsWith(".jsx") || filename.endsWith(".tsx")) return "javascript";
    if (filename.endsWith(".json")) return "json";
    if (filename.endsWith(".css")) return "css";
    if (filename.endsWith(".html")) return "html";
    return "javascript";
  };

  return (
    <div className="h-full w-full bg-editor">
      <Editor
        height="100%"
        language={getLanguage(activeFile)}
        theme={theme === "dark" ? "bp-dark" : "bp-light"}
        beforeMount={defineBuildPilotThemes}
        value={content || ""}
        onChange={onChange}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          lineHeight: 22,
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
