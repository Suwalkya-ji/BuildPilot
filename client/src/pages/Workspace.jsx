import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectApi, updateProjectApi } from "../api/project.api";
import { chatWithProjectApi } from "../api/ai.api";
import { useSocket } from "../hooks/useSocket";

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
      className="group flex-shrink-0 relative"
      style={{
        width: direction === "h" ? 5 : "100%",
        height: direction === "h" ? "100%" : 5,
        background: "rgba(255,255,255,0.06)",
        cursor: direction === "h" ? "col-resize" : "row-resize",
        zIndex: 20,
      }}
    >
      <div className="absolute inset-0 group-hover:bg-cyan-400/40 transition-colors duration-150" />
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
  const [rightW, setRightW] = useState(400); // Right column width
  const [previewH, setPreviewH] = useState(55); // Preview height % in right col

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
    onSuccess: (res) => {
      const updated = res.data || res;
      if (updated.generatedFiles) setFiles(updated.generatedFiles);
      if (updated.messages) setMessages(updated.messages);
      queryClient.invalidateQueries(["project", projectId]);
      toast.success("AI updated your codebase!");
    },
    onError: (err) => {
      toast.error(err?.message || "AI generation failed. Please try again.");
    },
  });

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
      <div className="flex h-screen items-center justify-center bg-[#0b0d13]">
        <Loader text="Loading your AI Workspace..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0d13] text-xs text-rose-400">
        Error: {error?.response?.data?.message || error?.message}
      </div>
    );
  }

  const currentFileObj =
    files.find((f) => (f.path || f.filePath) === activeFile) || files[0] || {};

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0b0d13] text-slate-100">

      {/* ── NAV ───────────────────────────────────────────── */}
      <Header
        projectTitle={project?.title}
        status={project?.status}
        onSave={() => saveMutation.mutate(files)}
        isSaving={saveMutation.isPending}
        files={files}
      />

      {/* ── 3-COLUMN BODY ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>

        {/* COL 1 — File Explorer */}
        <div style={{ width: fileW, flexShrink: 0 }} className="overflow-hidden">
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onSelectFile={handleSelectFile}
          />
        </div>

        {/* Drag: file | editor */}
        <DragBar direction="h" onDelta={onFileResize} />

        {/* COL 2 — Code Editor (fills remaining space) */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#1e1e1e]">
          <EditorTabs
            openTabs={openTabs}
            activeFile={activeFile}
            onSelectTab={setActiveFile}
            onCloseTab={handleCloseTab}
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
          className="flex flex-col overflow-hidden"
        >
          {/* Preview */}
          <div style={{ height: `${previewH}%` }} className="overflow-hidden">
            <Preview files={files} projectId={projectId} />
          </div>

          {/* Drag: preview | chat */}
          <DragBar direction="v" onDelta={onPreviewResize} />

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              messages={messages}
              onSendMessage={(msg) => chatMutation.mutate(msg)}
              isLoading={chatMutation.isPending}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Workspace;