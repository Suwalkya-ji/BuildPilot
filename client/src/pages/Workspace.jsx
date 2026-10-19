import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectApi, updateProjectApi } from "../api/project.api";
import { chatWithProjectApi } from "../api/ai.api";
import { useSocket } from "../hooks/useSocket";
import { ChevronDown } from "lucide-react";

import Header from "../components/workspace/Header";
import FileExplorer from "../components/workspace/FileExplorer";
import EditorTabs from "../components/workspace/EditorTabs";
import MonacoEditor from "../components/workspace/MonacoEditor";
import Preview from "../components/workspace/Preview";
import ChatPanel from "../components/workspace/ChatPanel";
import Loader from "../components/common/Loader";

// ─── Inline drag-handle (no 3rd-party library) ───────────────
const DragBar = ({ direction, onDelta }) => {
  const dragging = useRef(false);
  const last = useRef(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    last.current = direction === "h" ? e.clientX : e.clientY;

    const move = (ev) => {
      if (!dragging.current) return;
      const cur = direction === "h" ? ev.clientX : ev.clientY;
      onDelta(cur - last.current);
      last.current = cur;
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation={direction === "h" ? "vertical" : "horizontal"}
      aria-label="Resize panels"
      className={`group relative z-20 hidden shrink-0 md:block ${
        direction === "h" ? "h-full w-[5px] cursor-col-resize" : "h-[5px] w-full cursor-row-resize"
      }`}
    >
      <div
        className={`absolute bg-line ${
          direction === "h" ? "inset-y-0 left-1/2 w-px -translate-x-1/2" : "inset-x-0 top-1/2 h-px -translate-y-1/2"
        }`}
      />
      <div className="absolute inset-0 transition-colors duration-150 group-hover:bg-accent/40" />
    </div>
  );
};

// ─── Main Workspace ───────────────────────────────────────────
const Workspace = () => {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const containerRef = useRef(null);

  // Panel widths (px). Negative = auto (fills remaining space)
  const [fileW, setFileW] = useState(220);   // File Explorer width
  const [isFilesOpen, setIsFilesOpen] = useState(true); // Files sidebar collapse state
  const [rightW, setRightW] = useState(400); // Right column width
  const [previewH, setPreviewH] = useState(55); // Preview height % in right col

  // Mobile active tab state ("chat" | "code" | "preview")
  const [mobileTab, setMobileTab] = useState("code");

  const [activeFile, setActiveFile] = useState("src/App.jsx");
  const [openTabs, setOpenTabs] = useState(["src/App.jsx"]);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);

  // ── Fetch project ──────────────────────────────────────────
  const { data: projectRes, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectApi(projectId),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const proj = query.state.data?.data || query.state.data;
      if (proj?.status === "queued" || proj?.status === "generating") return 2000;
      return false;
    },
    refetchOnWindowFocus: false,
  });

  const project = projectRes?.data || projectRes;

  useSocket(projectId, (data) => {
    if (data.generatedFiles) setFiles(data.generatedFiles);
    else if (data.files) setFiles(data.files);
    queryClient.invalidateQueries(["project", projectId]);
  });

  useEffect(() => {
    if (!project) return;
    if (project.generatedFiles?.length > 0) {
      setFiles(project.generatedFiles);
      const paths = project.generatedFiles.map((f) => f.path || f.filePath);
      if (!paths.includes(activeFile)) {
        setActiveFile(paths[0]);
        setOpenTabs([paths[0]]);
      }
    }
    if (project.messages) setMessages(project.messages);
  }, [project]);

  // ── Drag handlers ─────────────────────────────────────────
  const onFileResize = useCallback((delta) => {
    setFileW((w) => Math.max(140, Math.min(400, w + delta)));
  }, []);

  const onRightResize = useCallback((delta) => {
    setRightW((w) => Math.max(260, Math.min(700, w - delta)));
  }, []);

  const onPreviewResize = useCallback((delta) => {
    if (!containerRef.current) return;
    const totalH = containerRef.current.clientHeight;
    setPreviewH((pct) => {
      const newPx = (pct / 100) * totalH + delta;
      return Math.max(15, Math.min(85, (newPx / totalH) * 100));
    });
  }, []);

  // ── File / tab handlers ───────────────────────────────────
  const handleSelectFile = (path) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) setOpenTabs((t) => [...t, path]);
  };

  const handleCloseTab = (path) => {
    const next = openTabs.filter((t) => t !== path);
    setOpenTabs(next);
    if (activeFile === path && next.length > 0) setActiveFile(next[next.length - 1]);
  };

  const handleContentChange = (newContent) => {
    setFiles((prev) =>
      prev.map((f) =>
        (f.path || f.filePath) === activeFile ? { ...f, content: newContent } : f
      )
    );
  };

  // ── Mutations ─────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (updatedFiles) =>
      updateProjectApi(projectId, { generatedFiles: updatedFiles }),
    onSuccess: () => {
      queryClient.invalidateQueries(["project", projectId]);
      toast.success("Changes saved successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to save changes. Please try again.");
    },
  });

  const chatMutation = useMutation({
    mutationFn: (message) => chatWithProjectApi({ projectId, message }),
    // Show the user's message right away instead of after the AI replies
    onMutate: (message) => {
      const previous = messages;
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      return { previous };
    },
    onSuccess: (res) => {
      const updated = res.data || res;
      if (updated.generatedFiles) setFiles(updated.generatedFiles);
      if (updated.messages) setMessages(updated.messages);
      queryClient.invalidateQueries(["project", projectId]);
      toast.success("AI updated your codebase!");
    },
    onError: (err, _message, context) => {
      if (context?.previous) setMessages(context.previous);
      toast.error(err?.message || "AI generation failed. Please try again.");
    },
  });

  // Live status shown in the chat while the AI is working
  let chatActivity = null;
  if (chatMutation.isPending) {
    chatActivity = files.length > 0 ? `Updating ${files.length} file${files.length === 1 ? "" : "s"}` : "Updating your code";
  } else if (project?.status === "queued") {
    chatActivity = "Queued — starting soon";
  } else if (project?.status === "generating") {
    chatActivity = "Generating your project";
  }

  // ── Ctrl+S shortcut (after mutations are declared) ────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saveMutation.isPending && files.length > 0) {
          saveMutation.mutate(files);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [files, saveMutation]);

  // ── Loading / error states ────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Loader text="Loading your workspace…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg p-4">
        <div className="alert-error max-w-md" role="alert">
          Error: {error?.response?.data?.message || error?.message}
        </div>
      </div>
    );
  }

  const currentFileObj =
    files.find((f) => (f.path || f.filePath) === activeFile) || files[0] || {};

  const mobileTabs = [
    { id: "chat", label: "Chat" },
    { id: "code", label: "Code" },
    { id: "preview", label: "Preview" },
  ];

  const fileOptions = Array.from(
    new Set(files.map((f) => f.path || f.filePath).filter(Boolean))
  );

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg text-fg">

      {/* ── NAV ───────────────────────────────────────────── */}
      <Header
        projectTitle={project?.title}
        status={project?.status}
        onSave={() => saveMutation.mutate(files)}
        isSaving={saveMutation.isPending}
        files={files}
        isFilesOpen={isFilesOpen}
        onToggleFiles={() => setIsFilesOpen(!isFilesOpen)}
      />

      {/* ── MOBILE SEGMENTED CONTROL (< md) ── */}
      <div
        role="tablist"
        aria-label="Workspace view"
        className="mx-3.5 mt-3 grid shrink-0 grid-cols-3 gap-1 rounded-full border border-line bg-surface p-1 md:hidden"
      >
        {mobileTabs.map((tab) => {
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="mobile-panel"
              onClick={() => setMobileTab(tab.id)}
              className={`h-10 rounded-full text-[13px] transition-colors duration-300 ${
                isActive ? "bg-brand font-semibold text-on-brand" : "font-medium text-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── MOBILE ONLY SINGLE PANEL CONTENT ── */}
      <div
        id="mobile-panel"
        role="tabpanel"
        key={mobileTab}
        className="anim-panel flex min-h-0 flex-1 flex-col overflow-hidden md:hidden"
      >
        {mobileTab === "chat" && (
          <div className="h-full w-full">
            <ChatPanel
              messages={messages}
              onSendMessage={(msg) => chatMutation.mutate(msg)}
              isLoading={chatMutation.isPending}
              activity={chatActivity}
            />
          </div>
        )}

        {mobileTab === "code" && (
          <div className="flex h-full w-full flex-col gap-2.5 p-3.5">
            <label className="relative block shrink-0">
              <span className="sr-only">Current file</span>
              <select
                value={activeFile || ""}
                onChange={(e) => handleSelectFile(e.target.value)}
                className="field h-11 appearance-none pr-10 font-mono text-[13px]"
              >
                {fileOptions.length === 0 && <option value={activeFile || ""}>{activeFile || "No files yet"}</option>}
                {fileOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </label>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-line bg-editor">
              <MonacoEditor
                activeFile={activeFile}
                content={currentFileObj.content || ""}
                onChange={handleContentChange}
              />
            </div>
          </div>
        )}

        {mobileTab === "preview" && (
          <div className="h-full w-full">
            <Preview files={files} />
          </div>
        )}
      </div>

      {/* ── DESKTOP 3-COLUMN BODY (Hidden on mobile < md) ── */}
      <div className="hidden flex-1 overflow-hidden md:flex" ref={containerRef}>

        {/* COL 1 — File Explorer */}
        {isFilesOpen && (
          <>
            <div style={{ width: fileW, flexShrink: 0 }} className="anim-up overflow-hidden">
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onSelectFile={handleSelectFile}
                onClose={() => setIsFilesOpen(false)}
              />
            </div>

            {/* Drag: file | editor */}
            <DragBar direction="h" onDelta={onFileResize} />
          </>
        )}

        {/* COL 2 — Code Editor (fills remaining space) */}
        <div className="anim-up d1 flex min-w-0 flex-1 flex-col overflow-hidden bg-editor">
          <EditorTabs
            openTabs={openTabs}
            activeFile={activeFile}
            onSelectTab={setActiveFile}
            onCloseTab={handleCloseTab}
            isFilesOpen={isFilesOpen}
            onOpenFiles={() => setIsFilesOpen(true)}
          />
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              activeFile={activeFile}
              content={currentFileObj.content || ""}
              onChange={handleContentChange}
            />
          </div>
        </div>

        {/* Drag: editor | right col */}
        <DragBar direction="h" onDelta={onRightResize} />

        {/* COL 3 — Live Preview (top) + Chat (bottom) */}
        <div
          style={{ width: rightW, flexShrink: 0 }}
          className="anim-up d2 flex flex-col overflow-hidden bg-surface"
        >
          {/* Preview */}
          <div style={{ height: `${previewH}%` }} className="overflow-hidden">
            <Preview files={files} />
          </div>

          {/* Drag: preview | chat */}
          <DragBar direction="v" onDelta={onPreviewResize} />

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              onSendMessage={(msg) => chatMutation.mutate(msg)}
              isLoading={chatMutation.isPending}
              activity={chatActivity}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Workspace;